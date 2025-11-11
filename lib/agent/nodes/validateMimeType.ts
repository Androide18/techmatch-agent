import { ALLOWED_MIME_TYPES } from '@/lib/constants';
import { AgentNode, AgentStateType } from '../graph';

export const validateFileMimeType = ({
  file,
}: {
  file: File;
}): AgentStateType => {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      error: {
        reason: `Invalid file type: ${
          file.type
        }. Allowed types are: ${ALLOWED_MIME_TYPES.join(', ')}.`,
        step: AgentNode.ValidateMimeType,
      },
    };
  }

  return { fileValidation: { mimeTypeValid: true } };
};
