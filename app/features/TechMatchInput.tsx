'use client';

import { useRef, useState } from 'react';
import { ArrowUp, FilePlus, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TechMatchInputProps {
  onStop: () => void;
  onSubmit: (query: string) => void | Promise<void>;
  isLoading: boolean;
  isProcessingPdf: boolean;
  setIsProcessingPdf: (t: boolean) => void;
}

export function TechMatchInput({
  onSubmit,
  onStop,
  isLoading,
  isProcessingPdf,
  setIsProcessingPdf,
}: TechMatchInputProps) {
  const [query, setQuery] = useState('');
  const [tooltipEnabled, setTooltipEnabled] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isInputEmpty = query.length === 0 && !selectedFile;

  const handleTooltipEnabled = (open: boolean) => {
    if (isInputEmpty) {
      setTooltipEnabled(open);
    } else {
      setTooltipEnabled(false);
    }
  };

  const handleFileClick = () => {
    // Trigger the hidden file input
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isProcessingPdf) return;

        // Handle PDF upload - two-step process
        if (selectedFile) {
          setIsProcessingPdf(true);

          try {
            // Step 1: Send PDF to processing endpoint
            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await fetch('/api/process-pdf', {
              method: 'POST',
              body: formData,
            });

            if (!response.ok) {
              const error = await response.json();
              console.error('PDF processing failed:', error);
              setIsProcessingPdf(false);
              return;
            }

            const { prompt } = await response.json();

            // Step 2: Submit the extracted prompt
            await onSubmit(prompt);

            // Clear state after successful submission
            setSelectedFile(null);
          } catch (error) {
            console.error('Error processing PDF:', error);
          } finally {
            setIsProcessingPdf(false);
          }

          return;
        }

        // Handle text query
        if (!query.trim()) return;
        onSubmit(query);
      }}
      className='max-w-4xl mx-auto w-full p-3 bg-slate-700/20 backdrop-blur-lg rounded-2xl flex flex-col gap-3 border border-gray-700 overflow-hidden relative'
    >
      <input
        type='file'
        ref={fileInputRef}
        className='hidden'
        onChange={handleFileChange}
        accept='application/pdf'
      />
      <div className='relative w-full'>
        {/* Input */}
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={2}
          className={cn(
            'resize-none max-h-42 border-none outline-none w-full relative z-10 bg-transparent field-sizing-content',
            selectedFile || isProcessingPdf ? 'pl-0 cursor-not-allowed' : 'pl-2'
          )}
          placeholder={
            selectedFile || isProcessingPdf
              ? ''
              : 'Escribe los requerimientos del puesto'
          }
          disabled={!!selectedFile || isProcessingPdf} // disable typing if file is selected or processing
        />

        {/* File card overlay */}
        {selectedFile && (
          <div className='absolute left-0 top-1/2 -translate-y-1/2 flex items-center bg-gray-700/80 text-gray-200 px-3 py-1 rounded-full gap-2 shadow-md z-20 pointer-events-auto'>
            <span className='text-sm font-medium truncate max-w-xs'>
              {selectedFile.name}
            </span>
            <button
              type='button'
              className='text-gray-300 hover:text-red-400 font-bold cursor-pointer'
              onClick={() => setSelectedFile(null)}
            >
              ×
            </button>
          </div>
        )}
      </div>

      <div className='flex justify-between items-center'>
        <Tooltip>
          <TooltipTrigger asChild onClick={handleFileClick}>
            <div
              className={cn(
                'border cursor-pointer border-gray-600 rounded-full p-2 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_3px_0] hover:shadow-gray-400'
              )}
            >
              <FilePlus size={20} className='text-slate-200' />
            </div>
          </TooltipTrigger>
          <TooltipContent>Subir PDF</TooltipContent>
        </Tooltip>
        <Tooltip
          open={tooltipEnabled}
          onOpenChange={handleTooltipEnabled}
          delayDuration={400}
        >
          <TooltipTrigger asChild>
            {isLoading || isProcessingPdf ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isProcessingPdf) {
                    onStop();
                  }
                }}
                type='button'
                className='border cursor-pointer rounded-full p-2 transition-duration-300 border-gray-600 hover:scale-110 hover:shadow-[0_0_5px_0] hover:shadow-gray-400 transition-all'
                disabled={isProcessingPdf}
              >
                <Square size={20} className='text-slate-200' />
              </button>
            ) : (
              <button
                type='submit'
                className={cn(
                  'border cursor-pointer border-gray-600 rounded-full p-2 transition-all duration-300',
                  isInputEmpty &&
                    'opacity-60 cursor-not-allowed hover:animate-shake',
                  !isProcessingPdf &&
                    !isInputEmpty &&
                    'hover:scale-110 hover:shadow-[0_0_5px_0] hover:shadow-gray-400'
                )}
              >
                <ArrowUp size={20} className='text-slate-200' />
              </button>
            )}
          </TooltipTrigger>
          <TooltipContent>
            {isProcessingPdf
              ? 'Procesando PDF...'
              : 'Ingresa requerimientos para enviar el mensaje'}
          </TooltipContent>
        </Tooltip>
      </div>

      <div
        className={cn(
          'bg-linear-to-r from-primary to-lime-200 h-full w-full absolute -bottom-26 blur-xl rounded-full left-1/2 -translate-x-1/2 -z-10 transition-all duration-500 ease-in-out',
          isLoading
            ? 'animate-pulse -translate-y-3 opacity-80'
            : 'translate-y-10 opacity-0'
        )}
      />
    </form>
  );
}
