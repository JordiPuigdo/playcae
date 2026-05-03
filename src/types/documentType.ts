import { BaseEntity } from "./baseEntity";

export interface DocumentType extends BaseEntity {
  code: string;
  name: string;
  legalPeriod?: number | null;
  isRequired: boolean;
  prompt?: string | null;
  extractDueDatePrompt?: string | null;
  excludeIfInternalPrevention: boolean;
}

export interface CreateDocumentTypeRequest {
  code: string;
  name: string;
  legalPeriod?: number | null;
  isRequired: boolean;
  prompt: string;
  extractDueDatePrompt: string;
  excludeIfInternalPrevention: boolean;
}

export interface UpdateDocumentTypeRequest {
  code: string;
  name: string;
  legalPeriod?: number | null;
  isRequired: boolean;
  prompt: string;
  extractDueDatePrompt: string;
  excludeIfInternalPrevention: boolean;
}
