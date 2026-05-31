import React from 'react';

import { Phone, Mail, MapPin, Instagram } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ContactInfoProps {
  contact: {
    whatsapp: string;
    instagram: string;
    email: string;
    address: string;
  };
  onWhatsAppClick: () => void;
  onInstagramClick: () => void;
  className?: string;
}

const ContactInfo: React.FC<ContactInfoProps> = ({
  contact,
  onWhatsAppClick,
  onInstagramClick,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-4 p-4 bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border border-allin-orange/10">
        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
          <Phone className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-allin-dark dark:text-allin-white">WhatsApp</h4>
          <p className="text-allin-dark/80 dark:text-allin-white/80">{contact.whatsapp}</p>
        </div>
        <Button
          onClick={onWhatsAppClick}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          Chamar
        </Button>
      </div>

      <div className="flex items-center gap-4 p-4 bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border border-allin-orange/10">
        <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
          <Instagram className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-allin-dark dark:text-allin-white">Instagram</h4>
          <p className="text-allin-dark/80 dark:text-allin-white/80">@{contact.instagram}</p>
        </div>
        <Button
          onClick={onInstagramClick}
          className="bg-pink-500 hover:bg-pink-600 text-white"
        >
          Seguir
        </Button>
      </div>

      <div className="flex items-center gap-4 p-4 bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border border-allin-orange/10">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
          <Mail className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-allin-dark dark:text-allin-white">Email</h4>
          <p className="text-allin-dark/80 dark:text-allin-white/80">{contact.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 p-4 bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border border-allin-orange/10">
        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
          <MapPin className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-allin-dark dark:text-allin-white">Endereço</h4>
          <p className="text-allin-dark/80 dark:text-allin-white/80">{contact.address}</p>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
