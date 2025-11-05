'use client';

import z from 'zod';
import { profileSchema } from '../api/search/schema';
import { TechMatchInput } from '../features/TechMatchInput';
import { experimental_useObject as useObject } from '@ai-sdk/react';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { ProfileCard } from './components/profile-card';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { InfoCard } from './components/info-card';

export default function Home() {
  const [userHasAsked, setUserHasAsked] = useState(false);

  const { isLoading, object, submit } = useObject({
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
          <h1 className='md:text-3xl text-2xl font-extrabold sirius-gradient inline-block bg-clip-text text-transparent'>
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

      <section className='flex-1 flex items-center w-full justify-center flex-col gap-10 z-10'>
        {isLoading && (
          <div className='flex flex-col gap-2 justify-center items-center'>
            <Loader2 className='animate-spin' />
            <span>Evaluando perfiles...</span>
          </div>
        )}
        {!userHasAsked && !isLoading ? (
          <div className='max-w-4xl text-center flex flex-col gap-2'>
            <motion.h3
              initial={{ translateY: 50, opacity: 0 }}
              animate={{ translateY: 0, opacity: 1 }}
              transition={{ ease: 'easeOut', duration: 0.35 }}
              className='text-3xl font-semibold text-balance'
            >
              Busca el perfil justo para ese puesto
            </motion.h3>
            <motion.p
              initial={{ translateY: 50, opacity: 0 }}
              animate={{ translateY: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.35, ease: 'easeOut' }}
              className='text-balance text-gray-400 leading-relaxed'
            >
              Optimiza la asignación de desarrolladores a proyectos usando IA.
              Analiza habilidades, experiencia previa y disponibilidad para
              ofrecerte el mejor match automáticamente.
            </motion.p>
          </div>
        ) : (
          <div className='w-full max-w-5xl space-y-4'>
            {object?.map((item, index) => (
              <ProfileCard key={index} profile={item} />
            ))}
          </div>
        )}
        {!userHasAsked && (
          <div className='flex flex-col items-center gap-10'>
            <TechMatchInput onSubmit={submit} isLoading={isLoading} />

            {/* Info Cards */}
            <div className='flex gap-4'>
              <InfoCard
                title='Asignación Inteligente'
                description='Encuentra automáticamente el mejor candidato para cada proyecto
            según skills, experiencia y carga actual.'
                color='text-secondary-1'
              />

              <InfoCard
                title='Scoring Dinámico'
                description='Calcula un score de compatibilidad para priorizar candidatos según
            experiencia real y afinidad tecnológica.'
                color='text-secondary-2'
              />

              <InfoCard
                title='Decisiones Basadas en Datos'
                description='Reduce el sesgo manual y toma decisiones más rápidas y precisas con
            evidencia del historial de proyectos.'
                color='text-secondary-3'
              />
            </div>
          </div>
        )}
      </section>

      <div className='absolute bottom-50 -translate-x-1/2 w-96 h-96 left-1/2 -z-10 mask-b-from-50% mask-t-from-50% mask-l-from-50% mask-r-from-50% opacity-40'>
        <img src='./sirius-logo.svg' />
      </div>
    </main>
  );
}
