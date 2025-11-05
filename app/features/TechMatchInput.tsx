'use client';

import { useState } from 'react';
import { ArrowUp, Plus, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TechMatchInputProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
}

export function TechMatchInput({ onSubmit, isLoading }: TechMatchInputProps) {
  const [query, setQuery] = useState('');
  const [tooltipEnabled, setTooltipEnabled] = useState(false);

  const isInputEmpty = query.length === 0;

  const handleTooltipEnabled = (open: boolean) => {
    if (isInputEmpty) {
      setTooltipEnabled(open);
    } else {
      setTooltipEnabled(false);
    }
  };

  return (
    <motion.form
      transition={{ duration: 0.4, ease: 'easeOut' }}
      initial={{
        translateY: 150,
        opacity: 0,
      }}
      animate={{
        translateY: 0,
        opacity: 1,
      }}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(query);
      }}
      className='max-w-4xl w-full p-3 bg-slate-700/20 rounded-4xl flex flex-col gap-3 border-2 border-gray-700 overflow-hidden relative'
    >
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className='border-none outline-none h-10'
        placeholder='Escribe los requerimientos del puesto'
      />
      <div className='flex justify-between items-center'>
        <div
          className={cn(
            'border cursor-pointer border-gray-600 rounded-full p-1 transition-all duration-300 hover:-rotate-12 hover:scale-110 hover:shadow-[0_0_5px_0] hover:shadow-gray-400',
            isLoading && 'border-gray-300'
          )}
        >
          <Plus />
        </div>
        <Tooltip
          open={tooltipEnabled}
          onOpenChange={handleTooltipEnabled}
          delayDuration={400}
        >
          <TooltipTrigger asChild>
            <button
              type='submit'
              className={cn(
                'border cursor-pointer border-gray-600 rounded-full p-1 transition-all duration-300',
                isLoading && 'border-gray-300 opacity-60',
                isInputEmpty &&
                  'opacity-60 cursor-not-allowed hover:animate-shake',
                !isLoading &&
                  !isInputEmpty &&
                  'hover:rotate-12 hover:scale-110 hover:shadow-[0_0_5px_0] hover:shadow-gray-400'
              )}
              disabled={isLoading || isInputEmpty}
            >
              {isLoading ? <Square /> : <ArrowUp />}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            Ingresa requerimientos para enviar el mensaje
          </TooltipContent>
        </Tooltip>
      </div>

      <div
        className={cn(
          'bg-linear-to-r from-primary to-lime-200 h-full w-full absolute -bottom-26 blur-xl rounded-full left-1/2 -translate-x-1/2 -z-10 transition-all duration-500 ease-in-out opacity-80',
          isLoading ? 'animate-pulse -translate-y-10' : 'translate-y-10'
        )}
      />
    </motion.form>
  );
}
