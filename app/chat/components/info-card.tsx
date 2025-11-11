import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { springTransition, visible, hidden } from '../animations';

interface InfoCardProp {
  title: string;
  description: string;
  color: string;
}

export const InfoCard = ({ title, description, color }: InfoCardProp) => {
  return (
    <motion.div
      variants={{ visible, hidden }}
      transition={springTransition()}
      className={cn(
        'p-4 rounded-2xl border border-slate-700 text-center bg-bg'
      )}
    >
      <h3 className={cn('text-base font-semibold mb-2', color)}>{title}</h3>
      <p className='text-gray-400 text-base'>{description}</p>
    </motion.div>
  );
};
