import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ComprasService {
  constructor(private http: HttpClient) {}

  // ☢️ Obtener las compras de un usuario
  getMisCompras(idUser: number): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/mis-compras`, {
      idUser,
    });
  }

  // ☢️ Obtener los productos de una compra específica
  getProductosDeCompra(idCompra: number): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/productos-compra`, {
      idCompra,
    });
  }
}
