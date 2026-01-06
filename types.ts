
export enum ToolType {
  CHAT = 'CHAT',
  VISION = 'VISION',
  SEARCH = 'SEARCH',
  ADVISOR = 'ADVISOR'
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  groundingSources?: Array<{ title: string; uri: string }>;
}

export interface UniversityInfo {
  name: string;
  url: string;
  faculties: string[];
}
