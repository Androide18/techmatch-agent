import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Settings2 } from 'lucide-react';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { modelCost, type LLM_MODEL } from '@/lib/llm_model';

interface QueryHistory {
  id: number;
  query: string;
  response: string;
  input_tokens: number;
  output_tokens: number;
  username: string;
  created_at: string;
  model_used: string;
}

const TokenUsage = async () => {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session')?.value;
  const username = sessionId ? sessionId.split('-')[0] : 'guest';

  const data = await fetch(`${process.env.API_BASE_URL}/history`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username }),
  });

  if (!data.ok) {
    throw new Error('Failed to fetch token usage data');
  }

  const tokenUsage: QueryHistory[] = await data.json();

  // Sort by created_at (newest first)
  const sortedHistory = [...tokenUsage].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Format timestamp to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calculate cost based on model used and tokens
  const calculateCost = (
    modelUsed: string,
    inputTokens: number,
    outputTokens: number
  ): number => {
    const model = modelUsed as LLM_MODEL;
    const costs = modelCost[model];

    if (!costs) {
      return 0; // Return 0 if model not found
    }

    const inputCost = inputTokens * costs.input;
    const outputCost = outputTokens * costs.output;

    return inputCost + outputCost;
  };

  return (
    <div className='min-h-screen bg-bg p-8'>
      <nav className='flex justify-between items-center w-full sticky top-0 z-20 bg-bg/60 backdrop-blur-lg p-4'>
        <div>
          <h1 className='md:text-3xl text-2xl font-extrabold sirius-gradient inline-block bg-clip-text text-transparent font-inter tracking-tight'>
            TechMatch Bot
          </h1>
          <h2 className='text-gray-400'>
            Agente de Asignación Inteligente de Recursos Técnicos
          </h2>
        </div>

        <div className='flex gap-4'>
          <DropdownMenu>
            <DropdownMenuTrigger className='uppercase font-medium text-slate-300 text-sm flex items-center gap-2 cursor-pointer hover:text-primary/90 transition-colors'>
              <Settings2 size={16} />
              <span>Ajustes</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel className='uppercase'>
                Ajustes
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href='/chat'>Chat</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href='/token-usage'>Uso de Tokens</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Cerrar sesión</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold text-main-light-blue mb-8'>
          Historial de Búsquedas
        </h1>

        {sortedHistory.length === 0 ? (
          <p className='text-gray-400'>No hay búsquedas registradas.</p>
        ) : (
          <div className='space-y-4'>
            {sortedHistory.map((item) => (
              <div
                key={item.id}
                className='bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-main-light-blue/50 transition-colors'
              >
                <div className='mb-3'>
                  <h3 className='text-lg font-medium text-white truncate'>
                    {item.query}
                  </h3>
                  <p className='text-sm text-gray-400 mt-1'>
                    {formatDate(item.created_at)}
                  </p>
                </div>

                <div className='flex flex-wrap gap-6 text-sm'>
                  <div>
                    <span className='text-gray-400'>Tokens de entrada: </span>
                    <span className='text-main-light-blue font-semibold'>
                      {item.input_tokens.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className='text-gray-400'>Tokens de salida: </span>
                    <span className='text-pink font-semibold'>
                      {item.output_tokens.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className='text-gray-400'>Costo aproximado: </span>
                    <span className='text-green-400 font-semibold'>
                      $
                      {calculateCost(
                        item.model_used,
                        item.input_tokens,
                        item.output_tokens
                      ).toFixed(6)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default TokenUsage;
