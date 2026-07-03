import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DiarizedTranscription, SpeakerSegment } from '../models/transcription.model';
import { ComplianceItem, QMComplianceReport, SilenceGap } from '../models/qm-compliance.model';
import { OpenaiQmAnalysisService } from './openai-qm-analysis.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class QmComplianceService {
  // Arabic keywords for detection
  private greetingKeywords = ['السلام', 'مرحبا', 'صباح', 'مساء', 'أهلا', 'أخبار', 'تحية'];
  private locationKeywords = ['موقع', 'عنوان', 'مكان', 'أين', 'المنطقة', 'الشارع', 'العنوان'];
  private incidentKeywords = ['حادث', 'مشكلة', 'قضية', 'ما حدث', 'وقع', 'حدث', 'الحالة'];
  private medicalKeywords = ['إصابة', 'طوارئ', 'إسعاف', 'طبي', 'نزيف', 'ألم', 'تنفس', 'جرح', 'طبية'];

  constructor(
    private openaiAnalysisService: OpenaiQmAnalysisService,
    private configService: ConfigService
  ) {}

  analyzeTranscriptionWithLLM(
    transcription: DiarizedTranscription,
    audioId: string
  ): Observable<QMComplianceReport> {
    console.log('[QMComplianceService] Using LLM-based analysis');
    return this.openaiAnalysisService.analyzeTranscriptionWithLLM(transcription, audioId);
  }

  analyzeTranscription(
    transcription: DiarizedTranscription,
    audioId: string
  ): QMComplianceReport {
    console.log('[QMComplianceService] Analyzing transcription:', { audioId, segmentCount: transcription.segments.length });

    const silenceGaps = this.detectSilence(transcription.segments);
    const totalSilenceDuration = silenceGaps.reduce((sum, gap) => sum + gap.duration, 0);
    const totalCallDuration = this.calculateCallDuration(transcription.segments);

    const report: QMComplianceReport = {
      audioId,
      completedAt: new Date(),
      items: {
        initialGreeting: this.detectInitialGreeting(transcription.segments),
        silenceDetection: this.detectSilenceCompliance(silenceGaps),
        locationInformation: this.detectInformation(transcription.segments, this.locationKeywords, 'Location'),
        incidentInformation: this.detectInformation(transcription.segments, this.incidentKeywords, 'Incident'),
        medicalEmergencyInformation: this.detectInformation(
          transcription.segments,
          this.medicalKeywords,
          'Medical/Emergency'
        )
      },
      silenceGaps,
      totalSilenceDuration,
      totalCallDuration,
      overallScore: this.calculateOverallScore({
        initialGreeting: this.detectInitialGreeting(transcription.segments),
        silenceDetection: this.detectSilenceCompliance(silenceGaps),
        locationInformation: this.detectInformation(transcription.segments, this.locationKeywords, 'Location'),
        incidentInformation: this.detectInformation(transcription.segments, this.incidentKeywords, 'Incident'),
        medicalEmergencyInformation: this.detectInformation(
          transcription.segments,
          this.medicalKeywords,
          'Medical/Emergency'
        )
      })
    };

    console.log('[QMComplianceService] Analysis complete:', report);
    return report;
  }

  private detectInitialGreeting(segments: SpeakerSegment[]): ComplianceItem {
    // Check if first agent message (within first 30 seconds) contains greeting
    const agentSegments = segments.filter(s => s.speaker === 'agent').slice(0, 3);

    if (agentSegments.length === 0) {
      return {
        id: 'initial-greeting',
        name: 'Initial Greeting',
        description: 'Agent provided proper greeting',
        status: 'unknown',
        confidence: 0,
        details: 'No agent speech found'
      };
    }

    const firstAgentMessage = agentSegments[0].text.toLowerCase();
    const greetingFound = this.greetingKeywords.some(keyword => firstAgentMessage.includes(keyword));
    const confidence = greetingFound ? 0.95 : 0.1;

    console.log('[QMComplianceService] Initial greeting detection:', { greetingFound, confidence });

    return {
      id: 'initial-greeting',
      name: 'Initial Greeting',
      description: 'Agent provided proper greeting',
      status: greetingFound ? 'pass' : 'fail',
      confidence: confidence,
      details: greetingFound ? 'Greeting detected in first agent message' : 'No greeting detected'
    };
  }

  private detectSilence(segments: SpeakerSegment[]): SilenceGap[] {
    const gaps: SilenceGap[] = [];
    const silenceThreshold = 10; // seconds

    for (let i = 0; i < segments.length - 1; i++) {
      const currentEnd = segments[i].endTime || 0;
      const nextStart = segments[i + 1].startTime || 0;
      const gap = nextStart - currentEnd;

      if (gap > silenceThreshold) {
        gaps.push({
          startTime: currentEnd,
          endTime: nextStart,
          duration: gap
        });
      }
    }

    console.log('[QMComplianceService] Silence detection:', { silenceGaps: gaps.length, gaps });
    return gaps;
  }

  private detectSilenceCompliance(silenceGaps: SilenceGap[]): ComplianceItem {
    const hasLongSilence = silenceGaps.length > 0;
    const maxSilence = silenceGaps.length > 0 ? Math.max(...silenceGaps.map(g => g.duration)) : 0;

    return {
      id: 'silence-detection',
      name: 'Silence Detection (>10 seconds)',
      description: 'No excessive silence gaps detected',
      status: hasLongSilence ? 'fail' : 'pass',
      confidence: 0.99,
      details: hasLongSilence ? `${silenceGaps.length} silence gap(s) detected. Max: ${maxSilence.toFixed(1)}s` : 'No silence gaps exceeding 10 seconds',
      timestamp: maxSilence
    };
  }

  private detectInformation(
    segments: SpeakerSegment[],
    keywords: string[],
    infoType: string
  ): ComplianceItem {
    const agentSegments = segments.filter(s => s.speaker === 'agent');
    const allText = agentSegments.map(s => s.text.toLowerCase()).join(' ');

    const keywordMatches = keywords.filter(keyword => allText.includes(keyword.toLowerCase()));
    const confidence = keywordMatches.length > 0 ? Math.min(0.95, 0.5 + keywordMatches.length * 0.15) : 0.1;
    const status = keywordMatches.length > 0 ? 'pass' : 'fail';

    console.log(`[QMComplianceService] ${infoType} detection:`, { keywordMatches, confidence });

    return {
      id: `${infoType.toLowerCase().replace(/\//g, '-')}-info`,
      name: `${infoType} Information`,
      description: `Agent asked for and received ${infoType.toLowerCase()}`,
      status,
      confidence,
      details: keywordMatches.length > 0 ? `Keywords found: ${keywordMatches.join(', ')}` : `No ${infoType.toLowerCase()} keywords detected`
    };
  }

  private calculateCallDuration(segments: SpeakerSegment[]): number {
    if (segments.length === 0) return 0;
    const firstStart = segments[0].startTime || 0;
    const lastEnd = segments[segments.length - 1].endTime || 0;
    return lastEnd - firstStart;
  }

  private calculateOverallScore(items: Record<string, ComplianceItem>): number {
    const values = Object.values(items);
    const passCount = values.filter(item => item.status === 'pass').length;
    const failCount = values.filter(item => item.status === 'fail').length;

    if (passCount + failCount === 0) return 0;
    return (passCount / (passCount + failCount)) * 100;
  }
}
