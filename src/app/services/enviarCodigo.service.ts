import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class enviarCodigoService {
  constructor(private http: HttpClient) {}

  // ☢️
  EnviarCodigo(gmail: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/envio-codigo`, { gmail });
  }
  
}
