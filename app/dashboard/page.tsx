'use client';

import z from 'zod';
import { profileSchema } from '../api/search/schema';
import { TechMatchInput } from '../features/TechMatchInput';
import { experimental_useObject as useObject } from '@ai-sdk/react';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { ProfileCard } from './components/profile-card';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'motion/react';
import { InfoCard } from './components/info-card';
import { hidden, list, springTransition, visible } from './animations';
import { information } from './constants';
import { cn } from '@/lib/utils';

export default function Home() {
  const [userHasAsked, setUserHasAsked] = useState(false);

  const { isLoading, object, submit, stop } = useObject({
    api: '/api/search',
    schema: z.array(profileSchema),
    onFinish: () => {
      setUserHasAsked(true);
    },
  });

  return (
    <main className='py-6 px-4 gap-10 max-w-7xl mx-auto flex flex-col h-dvh relative'>
      {/* Hero Section */}
      <nav className='flex justify-between items-center w-full'>
        <div>
          <h1 className='md:text-3xl text-2xl font-extrabold sirius-gradient inline-block bg-clip-text text-transparent font-inter tracking-tight'>
            TechMatch Bot
          </h1>
          <h2 className='text-gray-400'>
            Agente de Asignación Inteligente de Recursos Técnicos
          </h2>
        </div>

        {userHasAsked && (
          <div>
            <Button onClick={() => setUserHasAsked(false)}>
              Realizar otra busqueda
            </Button>
          </div>
        )}
      </nav>

      <section className='flex-1 z-10 relative justify-center items-center gap-52 flex flex-col'>
        <AnimatePresence>
          {!userHasAsked && !isLoading && (
            <div className='flex-1 min-h-42 justify-end max-w-4xl text-center flex flex-col gap-2'>
              <motion.h3
                initial={{ y: 70, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -70, opacity: 0 }}
                transition={springTransition()}
                className='text-3xl font-semibold text-balance selection:bg-primary selection:text-white'
              >
                Busca el perfil justo para ese puesto
              </motion.h3>
              <motion.p
                initial={{ y: 70, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -70, opacity: 0 }}
                transition={springTransition(0.1)}
                className='text-balance text-gray-400 leading-relaxed selection:bg-secondary-1 selection:text-black'
              >
                Optimiza la asignación de desarrolladores a proyectos usando IA.
                Analiza habilidades, experiencia previa y disponibilidad para
                ofrecerte el mejor match automáticamente.
              </motion.p>
            </div>
          )}
        </AnimatePresence>

        {userHasAsked && object && object.length > 0 && (
          <div className='w-full max-w-5xl space-y-4'>
            {object?.map((item, index) => (
              // @ts-expect-error profile interface matches
              <ProfileCard key={index} profile={item} />
            ))}
          </div>
        )}

        {!userHasAsked && (
          <div className='relative w-full h-full'>
            <motion.div
              className='w-full absolute bottom-[110%] left-1/2 -translate-x-1/2 z-20'
              transition={springTransition(isLoading ? 0.5 : 0)}
              variants={{ visible, hidden }}
              initial='hidden'
              animate={{
                opacity: 1,
                y: isLoading ? 100 : 0,
                ...(isLoading && { bottom: 120 }),
              }}
            >
              <TechMatchInput
                onSubmit={submit}
                isLoading={isLoading}
                onStop={stop}
              />
            </motion.div>
            <AnimatePresence>
              {!isLoading && (
                <motion.div
                  variants={list}
                  initial='hidden'
                  animate='visible'
                  exit='hidden'
                  transition={{ delay: 0.3 }}
                  className='flex gap-4'
                >
                  {information.map((card) => (
                    <InfoCard
                      key={card.id}
                      title={card.title}
                      description={card.description}
                      color={card.color}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </section>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.95, duration: 1, ease: 'easeOut' }}
        className={cn(
          'absolute top-60 -translate-x-1/2 w-96 h-96 left-1/2 -z-10 mask-b-from-50% mask-t-from-50% mask-l-from-50% mask-r-from-50% transition-all duration-500',
          isLoading && 'w-40 h-40 animate-[spin_2s_linear_infinite_200ms]'
        )}
      >
        <img src='./sirius-logo.svg' />
      </motion.div>
    </main>
  );
}
