
export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

export interface Lobby {
  id: string;
  name: string;
  code: string;
}

export interface CrewMember {
  id: string;
  memberId: string;
  name: string;
  lobbyId: string;
  rank: 'LP' | 'ALP';
}

export interface SubjectBook {
  id: string;
  title: string;
  type: 'GSR' | 'TECH';
  category: string; 
  subGroup?: 'Diesel' | 'AC' | 'GSR'; 
  format: 'PDF' | 'DOCX';
  fileName: string;
}

export interface Question {
  id: string;
  text: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  category: 'Concept' | 'Scenario' | 'Authority';
  explanation: string;
  topic?: string;
  subTopic?: string;
  topicSerial?: string;
  subTopicSerial?: string;
  pageReference?: string;
  hasImage?: boolean;
  imageUrl?: string;
}

export interface Section {
  id: string;
  name: string;
  questionCount: number;
  marksPerQuestion: number;
  negativeMarks: number;
  topics: string[];
  conceptInterpretationCount: number;
  scenarioApplicationCount: number;
  authorityLocationCount: number;
}

export interface DifficultyDistribution {
  easyPercentage: number;
  mediumPercentage: number;
  hardPercentage: number;
}

export interface ExamPattern {
  id: string;
  title: string;
  description: string;
  subject: string;
  subSubject?: string;
  totalDurationMinutes: number;
  totalMarks: number;
  sections: Section[];
  difficultyDistribution: DifficultyDistribution;
  createdAt: string;
}

export interface TestAttempt {
  id: string;
  patternId: string;
  patternTitle: string;
  lobbyId: string;
  lobbyCode: string;
  crewId: string;
  crewName: string;
  crewRank: 'LP' | 'ALP';
  score: number;
  totalPossible: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  completedAt: string;
  answers: Record<string, string>;
  questions: Question[]; 
}

export type AppView = 'home' | 'admin' | 'result' | 'test' | 'creator';
export type AdminTab = 'lobbies' | 'crew' | 'subjects' | 'patterns';
