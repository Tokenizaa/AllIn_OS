-- Migration: Admin Tools
-- Description: Tabela e funções para ferramentas administrativas

-- Tabela de admin_logs (auditoria)
CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES users(id),
  action_type TEXT NOT NULL CHECK (action_type IN ('change_user', 'manual_qualification', 'manual_order', 'balance_transfer')),
  target_distributor_id UUID REFERENCES distributors(id),
  old_value JSONB,
  new_value JSONB,
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_target_distributor_id ON admin_logs(target_distributor_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action_type ON admin_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at DESC);

-- Habilitar RLS
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- Política: Apenas admins podem ver logs
CREATE POLICY "Admins can view all logs"
ON admin_logs FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
    AND is_active = true
  )
);

-- Política: Apenas admins podem inserir logs
CREATE POLICY "Admins can insert logs"
ON admin_logs FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
    AND is_active = true
  )
);

-- Função: change_distributor_user
CREATE OR REPLACE FUNCTION change_distributor_user(
  p_distributor_id UUID,
  p_new_user_id UUID,
  p_reason TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_old_user_id UUID;
  v_admin_id UUID;
BEGIN
  -- Verificar se é admin
  SELECT user_id INTO v_admin_id
  FROM admin_users
  WHERE user_id = auth.uid()
  AND is_active = true;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Acesso negado: usuário não é administrador';
  END IF;

  -- Buscar usuário atual
  SELECT user_id INTO v_old_user_id
  FROM distributors
  WHERE id = p_distributor_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Distribuidor não encontrado';
  END IF;

  -- Atualizar usuário do distribuidor
  UPDATE distributors
  SET user_id = p_new_user_id,
      updated_at = NOW()
  WHERE id = p_distributor_id;

  -- Registrar log
  INSERT INTO admin_logs (
    admin_id,
    action_type,
    target_distributor_id,
    old_value,
    new_value,
    reason
  ) VALUES (
    v_admin_id,
    'change_user',
    p_distributor_id,
    jsonb_build_object('old_user_id', v_old_user_id),
    jsonb_build_object('new_user_id', p_new_user_id),
    p_reason
  );
END;
$$;

-- Função: add_manual_qualification
CREATE OR REPLACE FUNCTION add_manual_qualification(
  p_distributor_id UUID,
  p_qualification_level TEXT,
  p_period TEXT,
  p_reason TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_admin_id UUID;
  v_existing_qualification TEXT;
BEGIN
  -- Verificar se é admin
  SELECT user_id INTO v_admin_id
  FROM admin_users
  WHERE user_id = auth.uid()
  AND is_active = true;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Acesso negado: usuário não é administrador';
  END IF;

  -- Buscar qualificação existente
  SELECT qualification_level INTO v_existing_qualification
  FROM distributor_qualifications
  WHERE distributor_id = p_distributor_id
  AND period = p_period;

  -- Inserir ou atualizar qualificação
  IF v_existing_qualification IS NOT NULL THEN
    UPDATE distributor_qualifications
    SET qualification_level = p_qualification_level,
        is_manual = true,
        updated_at = NOW()
    WHERE distributor_id = p_distributor_id
    AND period = p_period;
  ELSE
    INSERT INTO distributor_qualifications (
      distributor_id,
      qualification_level,
      period,
      is_manual,
      created_at
    ) VALUES (
      p_distributor_id,
      p_qualification_level,
      p_period,
      true,
      NOW()
    );
  END IF;

  -- Registrar log
  INSERT INTO admin_logs (
    admin_id,
    action_type,
    target_distributor_id,
    old_value,
    new_value,
    reason
  ) VALUES (
    v_admin_id,
    'manual_qualification',
    p_distributor_id,
    jsonb_build_object('old_qualification', v_existing_qualification),
    jsonb_build_object(
      'new_qualification', p_qualification_level,
      'period', p_period
    ),
    p_reason
  );
END;
$$;

-- Função: create_manual_order
CREATE OR REPLACE FUNCTION create_manual_order(
  p_distributor_id UUID,
  p_product_id UUID,
  p_quantity INTEGER,
  p_total_amount DECIMAL,
  p_payment_method TEXT,
  p_reason TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_admin_id UUID;
  v_order_id UUID;
BEGIN
  -- Verificar se é admin
  SELECT user_id INTO v_admin_id
  FROM admin_users
  WHERE user_id = auth.uid()
  AND is_active = true;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Acesso negado: usuário não é administrador';
  END IF;

  -- Criar pedido manual
  INSERT INTO orders (
    distributor_id,
    status,
    total_amount,
    payment_method,
    is_manual,
    created_at
  ) VALUES (
    p_distributor_id,
    'completed',
    p_total_amount,
    p_payment_method,
    true,
    NOW()
  ) RETURNING id INTO v_order_id;

  -- Adicionar item ao pedido
  INSERT INTO order_items (
    order_id,
    product_id,
    quantity,
    price,
    created_at
  ) VALUES (
    v_order_id,
    p_product_id,
    p_quantity,
    p_total_amount / p_quantity,
    NOW()
  );

  -- Registrar log
  INSERT INTO admin_logs (
    admin_id,
    action_type,
    target_distributor_id,
    new_value,
    reason
  ) VALUES (
    v_admin_id,
    'manual_order',
    p_distributor_id,
    jsonb_build_object(
      'order_id', v_order_id,
      'product_id', p_product_id,
      'quantity', p_quantity,
      'total_amount', p_total_amount,
      'payment_method', p_payment_method
    ),
    p_reason
  );

  RETURN v_order_id;
END;
$$;

-- Função: transfer_balance
CREATE OR REPLACE FUNCTION transfer_balance(
  p_from_distributor_id UUID,
  p_to_distributor_id UUID,
  p_amount DECIMAL,
  p_reason TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_admin_id UUID;
  v_from_balance DECIMAL;
  v_to_balance DECIMAL;
BEGIN
  -- Verificar se é admin
  SELECT user_id INTO v_admin_id
  FROM admin_users
  WHERE user_id = auth.uid()
  AND is_active = true;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Acesso negado: usuário não é administrador';
  END IF;

  -- Buscar saldos
  SELECT balance INTO v_from_balance
  FROM distributor_wallets
  WHERE distributor_id = p_from_distributor_id;
  
  SELECT balance INTO v_to_balance
  FROM distributor_wallets
  WHERE distributor_id = p_to_distributor_id;

  IF v_from_balance IS NULL THEN
    RAISE EXCEPTION 'Carteira de origem não encontrada';
  END IF;

  IF v_to_balance IS NULL THEN
    RAISE EXCEPTION 'Carteira de destino não encontrada';
  END IF;

  IF v_from_balance < p_amount THEN
    RAISE EXCEPTION 'Saldo insuficiente';
  END IF;

  -- Realizar transferência
  UPDATE distributor_wallets
  SET balance = balance - p_amount,
      updated_at = NOW()
  WHERE distributor_id = p_from_distributor_id;

  UPDATE distributor_wallets
  SET balance = balance + p_amount,
      updated_at = NOW()
  WHERE distributor_id = p_to_distributor_id;

  -- Registrar transação de saída
  INSERT INTO wallet_transactions (
    distributor_id,
    type,
    amount,
    balance_after,
    reference_id,
    description,
    created_at
  ) VALUES (
    p_from_distributor_id,
    'transfer_out',
    p_amount,
    v_from_balance - p_amount,
    p_to_distributor_id,
    'Transferência manual: ' || p_reason,
    NOW()
  );

  -- Registrar transação de entrada
  INSERT INTO wallet_transactions (
    distributor_id,
    type,
    amount,
    balance_after,
    reference_id,
    description,
    created_at
  ) VALUES (
    p_to_distributor_id,
    'transfer_in',
    p_amount,
    v_to_balance + p_amount,
    p_from_distributor_id,
    'Transferência manual: ' || p_reason,
    NOW()
  );

  -- Registrar log
  INSERT INTO admin_logs (
    admin_id,
    action_type,
    target_distributor_id,
    old_value,
    new_value,
    reason
  ) VALUES (
    v_admin_id,
    'balance_transfer',
    p_from_distributor_id,
    jsonb_build_object('from_balance', v_from_balance),
    jsonb_build_object(
      'to_distributor_id', p_to_distributor_id,
      'amount', p_amount,
      'to_balance', v_to_balance + p_amount
    ),
    p_reason
  );
END;
$$;
