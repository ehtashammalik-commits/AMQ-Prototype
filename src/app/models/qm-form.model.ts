export interface QMCriteria {
  initialGreeting: boolean | null;
  silenceDetected: boolean;
  silenceDuration: number;
  askedLocation: boolean;
  askedIncident: boolean;
  askedMedicalInfo: boolean;
  requirementClarity: boolean | null;
}

export interface QMForm {
  id: string;
  audioCallId: string;
  criteria: QMCriteria;
  score: number;
  feedback: string;
  createdAt: Date;
  updatedAt: Date;
}
