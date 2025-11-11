import { HRAgentNode, HRAgentStateType } from '../../hr-agent/graph';

export const convertFileToBuffer = async ({
  file,
}: {
  file: File;
}): Promise<HRAgentStateType> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    return { fileBuffer };
  } catch (error) {
    return {
      error: {
        reason: `Failed to convert file to buffer: ${(error as Error).message}`,
        step: HRAgentNode.ConvertFileToBuffer,
      },
    };
  }
};
