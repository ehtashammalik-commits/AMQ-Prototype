export interface ComplianceItem {
  id: string;
  name: string;
  description: string;
  status: 'pass' | 'fail' | 'unknown';
  confidence: number;
  timestamp?: number;
  details?: string;
}

export interface SilenceGap {
  startTime: number;
  endTime: number;
  duration: number;
}

export interface QMComplianceReport {
  audioId: string;
  completedAt?: Date;
  items: {
    initialGreeting: ComplianceItem;
    silenceDetection: ComplianceItem;
    locationInformation: ComplianceItem;
    incidentInformation: ComplianceItem;
    medicalEmergencyInformation: ComplianceItem;
  };
  silenceGaps: SilenceGap[];
  totalSilenceDuration: number;
  totalCallDuration: number;
  overallScore: number;
  summary?: string;
}
