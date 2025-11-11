import { ALLOWED_MIME_TYPES } from '@/lib/constants';
import { PdfAgentNode, PdfAgentStateType } from '../graph';

export const validateFileMimeType = ({
  file,
}: {
  file: File;
}): PdfAgentStateType => {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      error: {
        reason: `Invalid file type: ${
          file.type
        }. Allowed types are: ${ALLOWED_MIME_TYPES.join(', ')}.`,
        step: PdfAgentNode.ValidateMimeType,
      },
    };
  }

  return { validation: { mimeTypeValid: true } };
};
