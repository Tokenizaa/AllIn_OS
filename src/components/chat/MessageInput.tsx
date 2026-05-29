import React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MessageInputProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
}

const MessageInput = ({ 
  inputValue, 
  onInputChange, 
  onSendMessage, 
  onKeyPress,
  isLoading
}: MessageInputProps) => {
  return (
    <div className="border-t border-allin-orange/20 p-2">
      <div className="flex space-x-1.5">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyPress}
          placeholder="Digite sua mensagem"
          className="flex-1 border-allin-orange/20 focus:border-allin-orange text-xs py-1 px-2"
          disabled={isLoading}
        />
        <Button
          variant="vibrant"
          onClick={onSendMessage}
          disabled={isLoading || !inputValue.trim()}
          className="px-2 py-1 text-xs"
        >
          Enviar
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;