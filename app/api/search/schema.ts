import z from 'zod';

export const profileSchema = z.object({
  fullName: z.string().describe('Nombre completo del desarrollador'),
  jobTitle: z.string().describe('Puesto o cargo'),
  seniority: z.string().describe('Nivel de seniority'),
  area: z.string().describe('Área o departamento'),
  skills: z
    .array(z.string())
    .describe('Lista de habilidades técnicas principales'),
  contractType: z.array(z.string()).describe('Tipos de contrato disponibles'),
  location: z.string().describe('Ubicación'),
  office: z.string().describe('Oficina'),
  email: z.string().describe('Email de contacto'),
  profilePictureUrl: z.string().optional().describe('URL de la foto de perfil'),
  similarityScore: z.string().describe('Porcentaje de similitud'),
  summary: z
    .string()
    .describe(
      'Resumen breve del perfil profesional y por qué encaja con el requerimiento'
    ),
});
