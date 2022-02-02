import { ServerService } from './../service/server.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InjectionToken } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RequestService } from './request.service';
import { ServerRequestInterceptor } from './server-interceptor';

export const HTTP_BASE_URL = new InjectionToken('http_base_url');

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  providers: [
    RequestService,
    ServerService,
    { provide: HTTP_BASE_URL, useValue: 'http://localhost:8070' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerRequestInterceptor,
      multi: true,
    },
  ],
})
export class ServerRequestModule {}
