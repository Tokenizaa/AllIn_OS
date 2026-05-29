import React from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItemProps {
  question: string;
  answer: string;
  value: string;
  className?: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ 
  question, 
  answer, 
  value,
  className = ''
}) => {
  return (
    <AccordionItem 
      value={value} 
      className={`bg-allin-bg-light-1 dark:bg-allin-bg-dark-1 rounded-lg border border-allin-orange/40 shadow-md glass-card animate-slide-up ${className}`}
    >
      <AccordionTrigger className="text-left font-semibold text-lg px-6 hover:no-underline text-allin-dark dark:text-allin-white hover:text-allin-orange transition-colors">
        {question}
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-6 text-allin-dark/80 dark:text-allin-white/80 leading-relaxed">
        {answer}
      </AccordionContent>
    </AccordionItem>
  );
};

export default FAQItem;