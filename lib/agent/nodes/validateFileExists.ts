import { AgentNode, AgentStateType } from '../graph';

export const validateFileExists = ({
  userInput,
}: AgentStateType): AgentStateType => {
  if (!(userInput instanceof FormData) || !userInput.has('file')) {
    return {
      error: {
        reason: 'No file provided.',
        step: AgentNode.ValidateFileExists,
      },
    };
  }

  const file = userInput.get('file') as File;

  return { file, fileValidation: { fileExists: true } };
};
