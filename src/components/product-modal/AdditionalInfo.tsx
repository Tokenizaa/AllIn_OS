import React from 'react';

import { UserPlus, Truck, RotateCcw, Shield, Package } from "lucide-react";

import { Button } from "@/components/ui/button";

interface AdditionalInfoProps {
  onClose: () => void;
}

const AdditionalInfo = ({ onClose }: AdditionalInfoProps) => {
  return (
    <>
      {/* Seção Separada - Venha Ser Revendedor */}
      <div className="border-t border-allin-orange/20 p-4 md:p-6 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 mx-4 md:mx-0">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <h3 className="text-xl md:text-lg font-bold text-allin-orange flex items-center justify-center md:justify-start gap-2">
              <UserPlus className="w-5 h-5" />
              Gostou do produto? Torne-se um revendedor!
            </h3>
            <p className="text-lg md:text-base text-allin-dark/80 dark:text-allin-white/80 mt-1">
              Transforme sua paixão em uma oportunidade de negócio com a All In Brasil.
            </p>
          </div>
          <Button
            variant="vibrantOutline"
            className="flex items-center justify-center gap-2 h-11 text-base font-semibold px-6 shrink-0"
            onClick={() => {
              window.location.href = '/distribuidores';
              onClose();
            }}
          >
            Saber Mais
          </Button>
        </div>
      </div>
      
      {/* Informações Adicionais - Rodapé */}
      <div className="border-t border-allin-orange/20 p-4 md:p-6 bg-allin-bg-light-1 dark:bg-allin-bg-dark-2 hidden mx-4 md:mx-0">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 md:w-6 md:h-6 text-allin-orange mt-1" />
            <div>
              <h4 className="text-xl md:text-lg font-bold text-allin-dark dark:text-allin-white">Frete Grátis</h4>
              <p className="text-lg md:text-base text-allin-dark/80 dark:text-allin-white/80">Para todo o Brasil</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <RotateCcw className="w-5 h-5 md:w-6 md:h-6 text-allin-orange mt-1" />
            <div>
              <h4 className="text-xl md:text-lg font-bold text-allin-dark dark:text-allin-white">Devolução Fácil</h4>
              <p className="text-lg md:text-base text-allin-dark/80 dark:text-allin-white/80">30 dias para troca</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 md:w-6 md:h-6 text-allin-orange mt-1" />
            <div>
              <h4 className="text-xl md:text-lg font-bold text-allin-dark dark:text-allin-white">Garantia</h4>
              <p className="text-lg md:text-base text-allin-dark/80 dark:text-allin-white/80">90 dias contra defeitos</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 md:w-6 md:h-6 text-allin-orange mt-1" />
            <div>
              <h4 className="text-xl md:text-lg font-bold text-allin-dark dark:text-allin-white">Entrega Rápida</h4>
              <p className="text-lg md:text-base text-allin-dark/80 dark:text-allin-white/80">Em até 5 dias úteis</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdditionalInfo;
