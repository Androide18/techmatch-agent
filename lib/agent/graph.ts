import { Annotation, END, START, StateGraph } from '@langchain/langgraph';
import { validateFileExists } from './nodes/validateFileExists';
import { validateFileSize } from './nodes/validateFileSize';
import { validateFileMimeType } from './nodes/validateMimeType';
import { convertFileToBuffer } from './nodes/convertFileToBuffer';
import { validateContent } from './nodes/validatePDFContent';
import { generatePromptFromPDF } from './nodes/generatePromptFromPDF';
import { validateTextInput } from './nodes/validateTextInput';
import { generateInputEmbedding } from './nodes/generateInputEmbedding';
import { getMatchingProfiles } from './nodes/getMatchingProfiles';
import { Profile } from '@/app/api/search-profiles/types';
import { buildContext } from './nodes/buildContext';

export enum AgentNode {
  RouteInputType = 'routeInputType',

  ValidateFileExists = 'validateFileExists',
  ValidateFileSize = 'validateFileSize',
  ValidateMimeType = 'validateMimeType',
  ConvertFileToBuffer = 'convertFileToBuffer',
  ValidateContent = 'validateContent',
  GenerateUserPromptFromPDF = 'generateUserPromptFromPDF',

  ValidateTextInput = 'validateTextInput',
  GenerateInputEmbedding = 'generateInputEmbedding',
  GetMatchingProfiles = 'getMatchingProfiles',
  BuildContext = 'buildContext',
}

const AgentState = Annotation.Root({
  userInput: Annotation<string | FormData>(),
  file: Annotation<File>(),
  fileBuffer: Annotation<Buffer>(),
  fileValidation: Annotation<
    Partial<{
      fileExists: boolean;
      fileSizeValid: boolean;
      mimeTypeValid: boolean;
      contentValid: boolean;
    }>
  >(),
  inputValidation: Annotation<Partial<{ isValid: boolean }>>(),
  inputEmbedding: Annotation<Array<number>>(),
  matchingProfiles: Annotation<Array<Profile>>(),
  context: Annotation<string>(),
  error: Annotation<{ reason: string; step: AgentNode }>(),
});

const conditionalEdge = (state: AgentStateType) =>
  state.userInput instanceof FormData ? 'file' : 'text';

export type AgentStateType = Partial<typeof AgentState.State>;
const workflow = new StateGraph(AgentState)
  .addNode(AgentNode.RouteInputType, (state: AgentStateType) => state)

  // File input nodes
  .addNode(AgentNode.ValidateFileExists, validateFileExists)
  .addNode(AgentNode.ValidateFileSize, validateFileSize)
  .addNode(AgentNode.ValidateMimeType, validateFileMimeType)
  .addNode(AgentNode.ConvertFileToBuffer, convertFileToBuffer)
  .addNode(AgentNode.ValidateContent, validateContent)
  .addNode(AgentNode.GenerateUserPromptFromPDF, generatePromptFromPDF)

  // Text input nodes
  .addNode(AgentNode.ValidateTextInput, validateTextInput)
  .addNode(AgentNode.GenerateInputEmbedding, generateInputEmbedding)
  .addNode(AgentNode.GetMatchingProfiles, getMatchingProfiles)
  .addNode(AgentNode.BuildContext, buildContext)

  .addEdge(START, AgentNode.RouteInputType)

  .addConditionalEdges(AgentNode.RouteInputType, conditionalEdge, {
    file: AgentNode.ValidateFileExists,
    text: AgentNode.ValidateTextInput,
  })

  // File workflow edges
  .addEdge(AgentNode.ValidateFileExists, AgentNode.ValidateFileSize)
  .addEdge(AgentNode.ValidateFileSize, AgentNode.ValidateMimeType)
  .addEdge(AgentNode.ValidateMimeType, AgentNode.ConvertFileToBuffer)
  .addEdge(AgentNode.ConvertFileToBuffer, AgentNode.ValidateContent)
  .addEdge(AgentNode.ValidateContent, AgentNode.GenerateUserPromptFromPDF)
  .addEdge(
    AgentNode.GenerateUserPromptFromPDF,
    AgentNode.GenerateInputEmbedding
  )

  // Text workflow edges
  .addEdge(AgentNode.ValidateTextInput, AgentNode.GenerateInputEmbedding)
  .addEdge(AgentNode.GenerateInputEmbedding, AgentNode.GetMatchingProfiles)
  .addEdge(AgentNode.GetMatchingProfiles, AgentNode.BuildContext)
  .addEdge(AgentNode.BuildContext, END);

export const agent = workflow.compile();
