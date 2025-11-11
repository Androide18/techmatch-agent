'use client';

import z from 'zod';
import { profileSchema } from '../api/search-profiles/schema';
import { TechMatchInput } from '../features/TechMatchInput';
import { experimental_useObject as useObject } from '@ai-sdk/react';
import { useState } from 'react';
import { ProfileCard } from './components/profile-card';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'motion/react';
import { InfoCard } from './components/info-card';
import {
  hidden,
  list,
  profileList,
  springTransition,
  visible,
} from './animations';
import { information } from './constants';
import { cn } from '@/lib/utils';
import { ProfileCardSkeleton } from './components/profile-card-skeleton';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [requestFinished, setRequestFinished] = useState(false);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);

  const {
    isLoading: searchingProfiles,
    object,
    clear,
    submit,
    stop,
  } = useObject({
    api: '/api/search-profiles',
    schema: z.array(profileSchema),
    onFinish: () => {
      setRequestFinished(true);
    },
  });

  const hasItems = object && object.length > 0;
  const isLoading = searchingProfiles || isProcessingPdf;

  const handleNewSearch = () => {
    setRequestFinished(false);
    clear();
  };

  const handleSubmit = (input: string) => {
    submit({ input });
  };

  return (
    <main className='py-6 px-4 gap-0 max-w-7xl mx-auto flex flex-col h-dvh relative'>
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

        {hasItems && (
          <div className='flex items-center gap-10'>
            {isLoading && (
              <span className='flex items-center gap-2 text-gray-400'>
                Evaluando Perfiles <Loader2 className='animate-spin' />
              </span>
            )}
            <Button disabled={isLoading} onClick={handleNewSearch}>
              Realizar otra búsqueda
            </Button>
          </div>
        )}
      </nav>

      <motion.section
        layout
        style={{ justifyContent: requestFinished ? 'flex-start' : 'center' }}
        className='flex-1 z-10 justify-center items-center gap-32 flex flex-col relative'
      >
        <AnimatePresence>
          {!requestFinished && !isLoading && (
            <div className='h-full justify-center max-w-4xl text-center flex flex-col gap-2'>
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

        {hasItems && (
          <motion.div
            variants={profileList}
            initial='hidden'
            animate='visible'
            exit='hidden'
            layout
            className='w-full max-w-5xl flex flex-col gap-6'
          >
            {object?.map((item, index) => (
              <ProfileCard
                profile={item}
                key={`${item?.fullName?.trim() || 'profile'}-${index}`}
              />
            ))}

            {!requestFinished && <ProfileCardSkeleton />}
          </motion.div>
        )}

        {requestFinished && !hasItems && (
          <div className='w-full items-center justify-center flex flex-col gap-4 flex-1'>
            <p>No se encontraron perfiles para tu busqueda</p>
            <Button disabled={isLoading} onClick={handleNewSearch}>
              Realizar nueva búsqueda
            </Button>
          </div>
        )}

        {!requestFinished && (
          <div className='relative w-full flex-1 flex flex-col'>
            <AnimatePresence>
              {!hasItems && (
                <motion.div
                  key='input'
                  className='w-full absolute bottom-[calc(100%+1.5rem)] left-1/2 -translate-x-1/2 z-20'
                  transition={springTransition(isLoading ? 0.4 : 0)}
                  variants={{ visible, hidden }}
                  initial='hidden'
                  animate={{
                    opacity: 1,
                    y: isLoading ? 100 : 0,
                    ...(isLoading && { bottom: 120 }),
                  }}
                  exit={{
                    opacity: 0,
                    y: 100,
                    transition: {
                      duration: 0.25,
                      ease: 'easeOut',
                    },
                  }}
                >
                  <TechMatchInput
                    onSubmit={handleSubmit}
                    isProcessingPdf={isProcessingPdf}
                    setIsProcessingPdf={setIsProcessingPdf}
                    isLoading={isLoading}
                    onStop={stop}
                  />
                </motion.div>
              )}
            </AnimatePresence>

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
      </motion.section>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1.0 }}
        transition={{ delay: 0.95, duration: 1, ease: 'easeOut' }}
        className={cn(
          'absolute top-60 -translate-x-1/2 left-1/2 flex flex-col items-center w-full'
        )}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          className='-z-10 mask-b-from-50% mask-t-from-50% mask-l-from-50% mask-r-from-50% transition duration-500'
        >
          <img
            src='./sirius-logo.svg'
            className={cn(
              'w-96 h-96 transition-all duration-500',
              isLoading &&
                !hasItems &&
                'w-40 h-40 animate-[spin_2s_linear_infinite_200ms]'
            )}
          />
        </motion.div>
        <AnimatePresence>
          {isLoading && !hasItems && (
            <motion.p
              transition={{ delay: 0.5, type: 'spring', bounce: 0.25 }}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 0.8, y: 0 }}
              exit={{ opacity: 0, y: 100, transition: { delay: 0.0 } }}
              className='z-40 text-xl absolute left-1/2 -translate-x-1/2 -bottom-10 tracking-wide bg-linear-to-br from-primary to-lime-200 bg-clip-text text-transparent  whitespace-nowrap'
            >
              Evaluando perfiles
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
