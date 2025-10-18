export type Language = 'ru' | 'en';

export type JobStatus = 'idle' | 'running' | 'completed' | 'error';

export interface GenerateParams {
  lang: Language;
  deadlineDays: number;
  query?: string;
  maxResults: number;
}

export interface Candidate {
  name: string;
  title: string;
  url: string;
  snippet?: string;
}

export interface Company {
  name?: string;
  url?: string;
  snippet?: string;
}

export interface ReportData {
  lang: Language;
  now: string;
  deadline: string;
  job_description: string;
  candidates: Candidate[];
  rationales: string[];
  company: Company;
}

export interface GenerateResponse {
  ok: boolean;
  data?: ReportData;
  files?: {
    pdfUrl: string;
    jsonUrl: string;
  };
  error?: string;
}
