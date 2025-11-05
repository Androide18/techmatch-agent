'use client';

import { useState } from 'react';
import { ArrowUp, Plus, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TechMatchInputProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
}

export function TechMatchInput({ onSubmit, isLoading }: TechMatchInputProps) {
  const [query, setQuery] = useState('');

  return (
    <div className='max-w-4xl w-full p-3 bg-slate-700/20 rounded-4xl flex flex-col gap-3 border-2 border-gray-700 overflow-hidden relative'>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className='border-none outline-none h-10'
        placeholder='Escribe los requerimientos del puesto'
      />
      <div className='flex justify-between items-center'>
        <div
          className={cn(
            'border cursor-pointer border-gray-600 rounded-full p-1 transition-all duration-500',
            isLoading && 'border-gray-300'
          )}
        >
          <Plus />
        </div>
        <button
          className={cn(
            'border cursor-pointer border-gray-600 rounded-full p-1 transition-all',
            isLoading && 'border-gray-300 opacity-60',
            query.length === 0 && 'opacity-60 cursor-not-allowed'
          )}
          disabled={isLoading || !query.length}
          onClick={() => onSubmit(query)}
        >
          {isLoading ? <Square /> : <ArrowUp />}
        </button>
      </div>

      <div
        className={cn(
          'bg-linear-to-r from-primary to-lime-200 h-full w-full absolute -bottom-26 blur-xl rounded-full left-1/2 -translate-x-1/2 -z-10 transition-all duration-500 ease-in-out opacity-80',
          isLoading ? 'animate-pulse -translate-y-10' : 'translate-y-10'
        )}
      />
    </div>
  );
}
