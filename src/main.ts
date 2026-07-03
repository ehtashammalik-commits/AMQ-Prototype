import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ConfigLoaderService } from './app/services/config-loader.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter([])
  ]
}).then(async (appRef) => {
  const configLoader = appRef.injector.get(ConfigLoaderService);
  await configLoader.loadConfig();
}).catch(err => console.error(err));
