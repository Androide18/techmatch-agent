import { PdfAgentNode, PdfAgentStateType } from '../graph';

export const validateFileExists = ({
  formData,
}: PdfAgentStateType): PdfAgentStateType => {
  if (!(formData instanceof FormData) || !formData.has('file')) {
    return {
      error: {
        reason: 'No file provided.',
        step: PdfAgentNode.ValidateFileExists,
      },
    };
  }

  return {
    validation: { fileExists: true },
    file: formData.get('file') as File,
  };
};
