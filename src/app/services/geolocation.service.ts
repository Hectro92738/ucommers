import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  constructor(
    private http: HttpClient
  ) {}

  getUbicacionVendedor(id: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/get-ubi`, { id });
  }

}
