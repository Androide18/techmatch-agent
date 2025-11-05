import { cn } from '@/lib/utils';

interface InfoCardProp {
  title: string;
  description: string;
  color: string;
}

export const InfoCard = ({ title, description, color }: InfoCardProp) => {
  return (
    <div
      className={cn(
        'p-4 rounded-2xl border-2 border-slate-700 text-center bg-bg'
      )}
    >
      <h3 className={cn('text-xl font-semibold mb-2', color)}>{title}</h3>
      <p className='text-gray-400'>{description}</p>
    </div>
  );
};
