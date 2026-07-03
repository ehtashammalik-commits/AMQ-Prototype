import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiEventsService {
  private openApiKeyDialogSubject = new Subject<'transcription' | 'analysis'>();
  public openApiKeyDialog$ = this.openApiKeyDialogSubject.asObservable();

  openApiKeyDialog(tab: 'transcription' | 'analysis' = 'transcription'): void {
    this.openApiKeyDialogSubject.next(tab);
  }
}
