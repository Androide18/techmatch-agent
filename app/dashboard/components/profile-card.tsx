'use client';

import { profileSchema } from '@/app/api/search/schema';
import { z } from 'zod';
import { useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, Mail } from 'lucide-react';

type Profile = z.infer<typeof profileSchema>;

interface ProfileCardProps {
  profile: Partial<Profile> | undefined;
}

export const ProfileCard = ({ profile }: ProfileCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-lg p-4 backdrop-blur-sm hover:border-main-light-blue/30 transition-all duration-300'>
      <div className='flex gap-4 items-start'>
        {/* Profile Picture */}
        <div className='shrink-0'>
          {profile?.profilePictureUrl ? (
            <img
              src={profile?.profilePictureUrl}
              alt={profile?.fullName ?? 'user photo'}
              className='w-16 h-16 rounded-full object-cover border-2 border-main-light-blue/20'
            />
          ) : (
            <div className='w-16 h-16 rounded-full bg-gradient-to-br from-pink/20 to-main-light-blue/20 flex items-center justify-center border-2 border-main-light-blue/20'>
              <span className='text-xl font-bold text-main-light-blue'>
                {profile?.fullName
                  ?.split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </span>
            </div>
          )}
        </div>

        {/* Profile Content */}
        <div className='flex-1 min-w-0'>
          {/* Header - Always Visible */}
          <div className='flex items-start justify-between gap-4'>
            <div className='flex-1 min-w-0'>
              <h3 className='text-xl font-bold text-white truncate'>
                {profile?.fullName}
              </h3>
              <p className='text-main-light-blue text-sm font-medium'>
                {profile?.jobTitle}
              </p>
              <div className='flex gap-2 mt-1 text-xs text-gray-400 flex-wrap'>
                <span>{profile?.seniority}</span>
                <span>•</span>
                <span>{profile?.location}</span>
              </div>
            </div>
            <div className='text-right shrink-0'>
              <div className='text-2xl font-bold sirius-gradient bg-clip-text text-transparent'>
                {profile?.similarityScore}
              </div>
              <div className='text-xs text-gray-400'>match</div>
            </div>
          </div>

          {/* Top Skills Preview */}
          <div className='flex flex-wrap gap-1.5 mt-3'>
            {profile?.skills?.slice(0, 3).map((skill, skillIndex) => (
              <span
                key={skillIndex}
                className='px-2 py-0.5 bg-main-light-blue/10 border border-main-light-blue/20 text-main-light-blue rounded-full text-xs'
              >
                {skill}
              </span>
            ))}
            {(profile?.skills?.length ?? 0) > 3 && (
              <span className='px-2 py-0.5 text-gray-400 text-xs'>
                +{(profile?.skills?.length ?? 0) - 3} más
              </span>
            )}
          </div>

          {/* Collapsible Details */}
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleContent className='space-y-3 mt-3'>
              {/* Summary */}
              <div className='pt-3 border-t border-gray-700/50'>
                <h4 className='text-xs font-semibold text-gray-400 mb-1.5'>
                  Resumen
                </h4>
                <p className='text-sm text-gray-300 leading-relaxed'>
                  {profile?.summary}
                </p>
              </div>

              {/* All Skills */}
              <div>
                <h4 className='text-xs font-semibold text-gray-400 mb-1.5'>
                  Todas las habilidades
                </h4>
                <div className='flex flex-wrap gap-1.5'>
                  {profile?.skills?.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className='px-2 py-0.5 bg-main-light-blue/10 border border-main-light-blue/20 text-main-light-blue rounded-full text-xs'
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div className='grid grid-cols-2 gap-3 text-xs'>
                <div>
                  <span className='text-gray-400'>Área: </span>
                  <span className='text-white'>{profile?.area}</span>
                </div>
                <div>
                  <span className='text-gray-400'>Oficina: </span>
                  <span className='text-white'>{profile?.office}</span>
                </div>
                <div className='col-span-2'>
                  <span className='text-gray-400'>Contrato: </span>
                  <span className='text-white'>
                    {profile?.contractType?.join(', ')}
                  </span>
                </div>
              </div>
            </CollapsibleContent>

            <div className='flex items-center justify-between mt-3 pt-3 border-t border-gray-700/50'>
              <a
                href={`mailto:${profile?.email}`}
                className='flex items-center gap-1.5 text-pink hover:text-pink/80 transition-colors text-sm font-medium'
              >
                <Mail className='w-4 h-4' />
                Contactar
              </a>
              <CollapsibleTrigger className='flex items-center gap-1 text-xs text-gray-400 hover:text-main-light-blue transition-colors'>
                {isOpen ? 'Ver menos' : 'Ver más'}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </CollapsibleTrigger>
            </div>
          </Collapsible>
        </div>
      </div>
    </div>
  );
};
