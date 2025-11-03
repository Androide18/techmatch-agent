'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface Profile {
  fullName: string;
  jobTitle: string;
  seniority: string;
  area: string;
  skills: string[];
  contractType: string[];
  location: string;
  office: string;
  email: string;
  profilePictureUrl?: string;
  similarityScore: string;
  summary: string;
}

export function TechMatchInput() {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!inputValue.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setUserQuery(inputValue);
    setProfiles([]);

    const query = inputValue;
    setInputValue('');

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await res.json();

      if (data.profiles && Array.isArray(data.profiles)) {
        setProfiles(data.profiles);
      } else {
        throw new Error('No profiles in response');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit();
    }
  };

  return (
    <div className='flex flex-col w-full max-w-3xl mx-auto gap-6'>
      {/* Input Section */}
      <div className='flex flex-col w-full bg-bg p-6 rounded-sm shadow-[0_0_10px_var(--color-light-blue-shadow)]'>
        <div className='flex flex-col gap-2 w-full'>
          <Label htmlFor='requirement-input'>Escribe tu requerimiento</Label>
          <Input
            id='requirement-input'
            placeholder='Ej: "Necesito un backend con NestJS y AWS"'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isLoading || !inputValue.trim()}
          className='mt-4 w-full sirius-gradient text-white hover:opacity-90'
        >
          {isLoading ? 'Buscando...' : 'Enviar'}
        </Button>
      </div>

      {/* Results Section */}
      {userQuery && (
        <div className='flex flex-col gap-4'>
          {/* User Query */}
          <div className='p-4 rounded-sm bg-main-light-blue/10 border border-main-light-blue/20'>
            <div className='font-semibold text-main-light-blue mb-2'>
              Tu requerimiento:
            </div>
            <div className='text-foreground whitespace-pre-wrap'>
              {userQuery}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className='p-4 rounded-sm bg-bg border border-main-light-blue/30'>
              <div className='text-foreground'>Buscando perfiles...</div>
            </div>
          )}

          {/* Profiles Results */}
          {profiles.length > 0 && (
            <div className='flex flex-col gap-3'>
              <div className='font-semibold text-main-light-blue'>
                Resultados ({profiles.length} perfiles encontrados):
              </div>
              {profiles.map((profile, index) => (
                <div
                  key={index}
                  className='p-4 rounded-sm bg-bg border border-main-light-blue/30'
                >
                  <div className='flex justify-between items-start mb-3'>
                    <div className='flex items-center gap-3'>
                      {profile.profilePictureUrl && (
                        <img
                          src={profile.profilePictureUrl}
                          alt={profile.fullName}
                          className='w-12 h-12 rounded-full object-cover'
                        />
                      )}
                      <div>
                        <div className='font-semibold text-main-light-blue text-lg'>
                          {profile.fullName}
                        </div>
                        <div className='text-xs text-foreground/60'>
                          {profile.email}
                        </div>
                      </div>
                    </div>
                    <div className='text-xs text-main-light-blue/70 font-medium'>
                      {profile.similarityScore}% match
                    </div>
                  </div>

                  <div className='text-sm text-foreground/90 mb-3 italic'>
                    {profile.summary}
                  </div>

                  <div className='grid grid-cols-2 gap-2 text-sm text-foreground/80 mb-3'>
                    <div>
                      <span className='font-medium'>Puesto:</span>{' '}
                      {profile.jobTitle}
                    </div>
                    <div>
                      <span className='font-medium'>Seniority:</span>{' '}
                      {profile.seniority}
                    </div>
                    <div>
                      <span className='font-medium'>Área:</span> {profile.area}
                    </div>
                    <div>
                      <span className='font-medium'>Ubicación:</span>{' '}
                      {profile.location}
                    </div>
                  </div>

                  <div className='mb-2'>
                    <div className='text-xs font-medium text-main-light-blue mb-1'>
                      Skills:
                    </div>
                    <div className='flex flex-wrap gap-1'>
                      {profile.skills.map((skill, i) => (
                        <span
                          key={i}
                          className='text-xs px-2 py-1 bg-main-light-blue/10 border border-main-light-blue/30 rounded'
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className='text-xs text-foreground/60'>
                    <span className='font-medium'>Contrato:</span>{' '}
                    {profile.contractType.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className='p-4 rounded-sm bg-red-500/10 border border-red-500/30 text-red-400'>
          Error: {error}
        </div>
      )}
    </div>
  );
}
