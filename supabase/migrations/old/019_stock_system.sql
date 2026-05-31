-- Migration: Stock System
-- Description: Tabelas e funções para sistema de estoque

-- Tabela de stock
CREATE TABLE IF NOT EXISTS stock (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 0 CHECK (quantity >= 0),
  reserved_quantity INTEGER DEFAULT 0 CHECK (reserved_quantity >= 0),
  available_quantity INTEGER GENERATED ALWAYS AS (quantity - reserved_quantity) STORED,
  low_stock_threshold INTEGER DEFAULT 10 CHECK (low_stock_threshold >= 0),
  location TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de stock_movements
CREATE TABLE IF NOT EXISTS stock_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stock_id UUID REFERENCES stock(id) ON DELETE CASCADE,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('in', 'out', 'adjustment')),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  reason TEXT,
  reference_id UUID,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_stock_product_id ON stock(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_available_quantity ON stock(available_quantity);
CREATE INDEX IF NOT EXISTS idx_stock_movements_stock_id ON stock_movements(stock_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created_at ON stock_movements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stock_movements_movement_type ON stock_movements(movement_type);

-- Habilitar RLS
ALTER TABLE stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

-- Políticas para stock
CREATE POLICY "Admins can view all stock"
ON stock FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
    AND is_active = true
  )
);

CREATE POLICY "Admins can insert stock"
ON stock FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
    AND is_active = true
  )
);

CREATE POLICY "Admins can update stock"
ON stock FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
    AND is_active = true
  )
);

-- Políticas para stock_movements
CREATE POLICY "Admins can view all stock movements"
ON stock_movements FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
    AND is_active = true
  )
);

CREATE POLICY "Admins can insert stock movements"
ON stock_movements FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
    AND is_active = true
  )
);

-- Função: add_stock_movement
CREATE OR REPLACE FUNCTION add_stock_movement(
  p_stock_id UUID,
  p_movement_type TEXT,
  p_quantity INTEGER,
  p_reason TEXT,
  p_reference_id UUID DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_quantity INTEGER;
  v_new_quantity INTEGER;
BEGIN
  -- Verificar se é admin
  IF NOT EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
    AND is_active = true
  ) THEN
    RAISE EXCEPTION 'Acesso negado: usuário não é administrador';
  END IF;

  -- Buscar quantidade atual
  SELECT quantity INTO v_current_quantity
  FROM stock
  WHERE id = p_stock_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Estoque não encontrado';
  END IF;

  -- Calcular nova quantidade
  IF p_movement_type = 'in' THEN
    v_new_quantity := v_current_quantity + p_quantity;
  ELSIF p_movement_type = 'out' THEN
    IF v_current_quantity < p_quantity THEN
      RAISE EXCEPTION 'Quantidade insuficiente em estoque';
    END IF;
    v_new_quantity := v_current_quantity - p_quantity;
  ELSIF p_movement_type = 'adjustment' THEN
    v_new_quantity := p_quantity;
  ELSE
    RAISE EXCEPTION 'Tipo de movimentação inválido';
  END IF;

  -- Atualizar estoque
  UPDATE stock
  SET quantity = v_new_quantity,
      updated_at = NOW()
  WHERE id = p_stock_id;

  -- Registrar movimentação
  INSERT INTO stock_movements (
    stock_id,
    movement_type,
    quantity,
    reason,
    reference_id,
    created_by
  ) VALUES (
    p_stock_id,
    p_movement_type,
    p_quantity,
    p_reason,
    p_reference_id,
    auth.uid()
  );
END;
$$;

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_stock_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER stock_updated_at
  BEFORE UPDATE ON stock
  FOR EACH ROW
  EXECUTE FUNCTION update_stock_updated_at();
