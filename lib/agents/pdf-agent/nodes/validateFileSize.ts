import { MAX_FILE_SIZE_BYTES } from '@/lib/constants';
import { PdfAgentNode, PdfAgentStateType } from '../graph';

export const validateFileSize = ({
  file,
}: {
  file: File;
}): PdfAgentStateType => {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      error: {
        reason: `File size exceeds the ${
          MAX_FILE_SIZE_BYTES / (1024 * 1024)
        }MB limit.`,
        step: PdfAgentNode.ValidateFileSize,
      },
    };
  }

  return { validation: { fileSizeValid: true } };
};
