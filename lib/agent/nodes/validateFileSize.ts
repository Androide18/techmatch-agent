import { MAX_FILE_SIZE_BYTES } from '@/lib/constants';
import { AgentNode, AgentStateType } from '../graph';

export const validateFileSize = ({ file }: { file: File }): AgentStateType => {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      error: {
        reason: `File size exceeds the ${
          MAX_FILE_SIZE_BYTES / (1024 * 1024)
        }MB limit.`,
        step: AgentNode.ValidateFileSize,
      },
    };
  }

  return { fileValidation: { fileSizeValid: true } };
};
