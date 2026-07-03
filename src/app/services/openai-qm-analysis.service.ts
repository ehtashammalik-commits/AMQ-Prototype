import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { DiarizedTranscription } from '../models/transcription.model';
import { QMComplianceReport, ComplianceItem } from '../models/qm-compliance.model';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class OpenaiQmAnalysisService {
  private openaiEndpoint = 'https://api.openai.com/v1/chat/completions';

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {}

  analyzeTranscriptionWithLLM(
    transcription: DiarizedTranscription,
    audioId: string
  ): Observable<QMComplianceReport> {
    const config = this.configService.getOpenAIConfig();

    if (!config?.apiKey) {
      console.error('[OpenAIQMService] ✗ OpenAI API key not set!');
      return throwError(() => new Error('OpenAI API key not configured'));
    }

    if (config.apiKey === 'sk-your-api-key-here') {
      console.error('[OpenAIQMService] ✗ API key is still the template placeholder!');
      return throwError(() => new Error('Please set a valid OpenAI API key'));
    }

    console.log('[OpenAIQMService] Starting LLM-based QM analysis...', {
      audioId,
      segmentCount: transcription.segments.length,
      model: config.analysisModel || 'gpt-4o'
    });

    const prompt = this.buildAnalysisPrompt(transcription);
    const requestBody = {
      model: config.analysisModel || 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a Quality Management (QM) expert analyzing customer service call transcriptions.
          Analyze the following Arabic call transcript and evaluate it against these QM criteria:
          1. Initial Greeting - Did the agent provide a proper greeting?
          2. Silence Detection - Are there excessive silence gaps (>10 seconds)?
          3. Location Information - Did the agent ask for and receive location details?
          4. Incident Information - Did the agent ask for and receive incident details?
          5. Medical/Emergency Information - Did the agent ask for and receive medical/emergency information if relevant?
          6. Call Duration and Flow - Was the call professional and well-structured?

          Respond in JSON format only.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1500
    };

    return from(
      this.http.post<any>(this.openaiEndpoint, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        }
      }).toPromise()
    ).pipe(
      map(response => this.parseAnalysisResponse(response, audioId, transcription)),
      catchError(error => {
        console.error('[OpenAIQMService] ✗ API Error:', error);
        return throwError(() => new Error(`OpenAI API Error: ${error.message}`));
      })
    );
  }

  private buildAnalysisPrompt(transcription: DiarizedTranscription): string {
    const segments = transcription.segments
      .map(s => `[${s.speaker.toUpperCase()}] (${s.startTime?.toFixed(1)}s): ${s.text}`)
      .join('\n');

    return `
Analyze this customer service call transcript and provide a structured QM evaluation:

TRANSCRIPT:
${segments}

Provide your analysis as a JSON object with this exact structure:
{
  "initialGreeting": {
    "status": "pass|fail|unknown",
    "confidence": 0.0-1.0,
    "details": "explanation"
  },
  "silenceDetection": {
    "status": "pass|fail|unknown",
    "confidence": 0.0-1.0,
    "details": "explanation of any silence gaps found"
  },
  "locationInformation": {
    "status": "pass|fail|unknown",
    "confidence": 0.0-1.0,
    "details": "explanation"
  },
  "incidentInformation": {
    "status": "pass|fail|unknown",
    "confidence": 0.0-1.0,
    "details": "explanation"
  },
  "medicalEmergencyInformation": {
    "status": "pass|fail|unknown",
    "confidence": 0.0-1.0,
    "details": "explanation"
  },
  "overallScore": 0-100,
  "summary": "brief assessment of call quality"
}

Only respond with valid JSON, no other text.
`;
  }

  private parseAnalysisResponse(
    response: any,
    audioId: string,
    transcription: DiarizedTranscription
  ): QMComplianceReport {
    try {
      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content in OpenAI response');
      }

      // Extract JSON from response (handle case where there might be markdown code blocks)
      let jsonStr = content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }

      const analysis = JSON.parse(jsonStr);

      const report: QMComplianceReport = {
        audioId,
        completedAt: new Date(),
        items: {
          initialGreeting: this.mapComplianceItem('initial-greeting', 'Initial Greeting', analysis.initialGreeting),
          silenceDetection: this.mapComplianceItem('silence-detection', 'Silence Detection (>10 seconds)', analysis.silenceDetection),
          locationInformation: this.mapComplianceItem('location-info', 'Location Information', analysis.locationInformation),
          incidentInformation: this.mapComplianceItem('incident-info', 'Incident Information', analysis.incidentInformation),
          medicalEmergencyInformation: this.mapComplianceItem('medical-info', 'Medical/Emergency Information', analysis.medicalEmergencyInformation)
        },
        silenceGaps: [],
        totalSilenceDuration: 0,
        totalCallDuration: this.calculateCallDuration(transcription.segments),
        overallScore: analysis.overallScore || 0,
        summary: analysis.summary
      };

      console.log('[OpenAIQMService] ✓ Analysis complete:', { audioId, score: report.overallScore });
      return report;
    } catch (error) {
      console.error('[OpenAIQMService] ✗ Error parsing response:', error);
      throw new Error(`Failed to parse OpenAI analysis: ${error}`);
    }
  }

  private mapComplianceItem(id: string, name: string, analysisItem: any): ComplianceItem {
    return {
      id,
      name,
      description: name,
      status: (analysisItem?.status || 'unknown') as 'pass' | 'fail' | 'unknown',
      confidence: analysisItem?.confidence ?? 0,
      details: analysisItem?.details || 'No details provided'
    };
  }

  private calculateCallDuration(segments: any[]): number {
    if (segments.length === 0) return 0;
    const firstStart = segments[0].startTime || 0;
    const lastEnd = segments[segments.length - 1].endTime || 0;
    return lastEnd - firstStart;
  }
}
