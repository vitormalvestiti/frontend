import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificationComponent } from './app/components/notification/notification.component';


bootstrapApplication(NotificationComponent, {
  providers: [
    provideHttpClient(),
    importProvidersFrom(FormsModule)
  ],
});
