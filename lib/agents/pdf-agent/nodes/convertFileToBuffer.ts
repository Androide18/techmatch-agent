import { PdfAgentNode, PdfAgentStateType } from '../graph';

export const convertFileToBuffer = async ({
  file,
}: {
  file: File;
}): Promise<PdfAgentStateType> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    return { fileBuffer };
  } catch (error) {
    return {
      error: {
        reason: `Failed to convert file to buffer: ${(error as Error).message}`,
        step: PdfAgentNode.ConvertFileToBuffer,
      },
    };
  }
};
