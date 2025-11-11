import { Annotation, END, START, StateGraph } from '@langchain/langgraph';
import { validateFileExists } from './nodes/validateFileExists';
import { validateFileSize } from './nodes/validateFileSize';
import { validateFileMimeType } from './nodes/validateMimeType';
import { convertFileToBuffer } from './nodes/convertFileToBuffer';
import { validateContent } from './nodes/validatePDFContent';
import { generatePromptFromPDF } from './nodes/generatePromptFromPDF';

export enum PdfAgentNode {
  ValidateFileExists = 'validateFileExists',
  ValidateFileSize = 'validateFileSize',
  ValidateMimeType = 'validateMimeType',
  ConvertFileToBuffer = 'convertFileToBuffer',
  ValidateContent = 'validateContent',
  GenerateUserPromptFromPDF = 'generatePrompt',
}

const PdfAgentState = Annotation.Root({
  formData: Annotation<FormData>(),
  file: Annotation<File>(),
  fileBuffer: Annotation<Buffer>(),
  validation: Annotation<
    Partial<{
      fileExists: boolean;
      fileSizeValid: boolean;
      mimeTypeValid: boolean;
      contentValid: boolean;
    }>
  >(),
  generatedPrompt: Annotation<string>(),
  error: Annotation<{ reason: string; step: PdfAgentNode }>(),
});

export type PdfAgentStateType = Partial<typeof PdfAgentState.State>;

const workflow = new StateGraph(PdfAgentState)
  .addNode(PdfAgentNode.ValidateFileExists, validateFileExists)
  .addNode(PdfAgentNode.ValidateFileSize, validateFileSize)
  .addNode(PdfAgentNode.ValidateMimeType, validateFileMimeType)
  .addNode(PdfAgentNode.ConvertFileToBuffer, convertFileToBuffer)
  .addNode(PdfAgentNode.ValidateContent, validateContent)
  .addNode(PdfAgentNode.GenerateUserPromptFromPDF, generatePromptFromPDF)

  .addEdge(START, PdfAgentNode.ValidateFileExists)
  .addEdge(PdfAgentNode.ValidateFileExists, PdfAgentNode.ValidateFileSize)
  .addEdge(PdfAgentNode.ValidateFileSize, PdfAgentNode.ValidateMimeType)
  .addEdge(PdfAgentNode.ValidateMimeType, PdfAgentNode.ConvertFileToBuffer)
  .addEdge(PdfAgentNode.ConvertFileToBuffer, PdfAgentNode.ValidateContent)
  .addEdge(PdfAgentNode.ValidateContent, PdfAgentNode.GenerateUserPromptFromPDF)
  .addEdge(PdfAgentNode.GenerateUserPromptFromPDF, END);

export const pdfAgent = workflow.compile();
