import { AgentNode, AgentStateType } from '../graph';

export const convertFileToBuffer = async ({
  file,
}: {
  file: File;
}): Promise<AgentStateType> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    return { fileBuffer };
  } catch (error) {
    return {
      error: {
        reason: `Failed to convert file to buffer: ${(error as Error).message}`,
        step: AgentNode.ConvertFileToBuffer,
      },
    };
  }
};
