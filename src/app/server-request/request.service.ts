import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  constructor(private http: HttpClient) {}

  public login(data): Observable<any> {
    console.log(data);
    return this.sendRequest('server/login', 'post', data);
  }

  public servers(): Observable<any> {
    return this.sendRequest('server/list', 'get');
  }

  private sendRequest<T>(
    url: string,
    method: string,
    body?: any
  ): Observable<T> {
    return this.send(this.generateUrl(url), method, body);
  }

  private send<T>(url: string, method: string, body?: any): Observable<T> {
    return this.http.request<T>(method, url, {
      body: body,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }

  private generateUrl(url: string): string {
    return `http://localhost:8070/${url}`;
  }
}
