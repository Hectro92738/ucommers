import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private cantidadProductos = new BehaviorSubject<number>(
    this.obtenerCantidadInicial()
  );
  cantidadProductos$ = this.cantidadProductos.asObservable();

  constructor(private http: HttpClient) {}

  // Obtener la cantidad inicial desde localStorage
  private obtenerCantidadInicial(): number {
    const cantidad = localStorage.getItem('cantidadProductosCarrito');
    return cantidad ? parseInt(cantidad, 10) : 0;
  }

  // Método para actualizar la cantidad de productos en el carrito
  actualizarCantidad(cantidad: number) {
    this.cantidadProductos.next(cantidad);
    localStorage.setItem('cantidadProductosCarrito', cantidad.toString());
  }

  // Método para obtener la cantidad actual de productos en el carrito
  obtenerCantidad(): number {
    return this.cantidadProductos.value;
  }

  // --------------------------
  getProductos(id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/get-carrito/${id}`);
  }

  EliminarDelCarrito(idProd: number, idUser: number): Observable<any> {
    return this.http.delete<any>(
      `${environment.apiUrl}/delete-carrito/${idProd}/${idUser}`
    );
  }

  completarCompra(productos: any[], idUser: number): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/compra`, {
      productos,
      idUser,
    });
  }

  // ☢️
  agregarProductoAlCarrito(
    productoId: number,
    userId: number
  ): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/insert-carrito/${productoId}/${userId}`,
      null
    );
  }
}
