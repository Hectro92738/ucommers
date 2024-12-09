import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  
  // BehaviorSubject para manejar la cantidad de productos en el carrito
  private cantidadProductos = new BehaviorSubject<number>(0);
  // Observable para q otras partes de la aplicación puedan escuchar cambios
  cantidadProductos$ = this.cantidadProductos.asObservable();

  constructor(private http: HttpClient) {}

  //☢️ Método para agregar un nuevo producto
  addProduct(productData: any): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/insert-productos`,
      productData
    );
  }
  
  // ☢️ Método Trae todos los productos
  getProductos(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/all-productos`);
  }

  // ☢️
  getProductoPorId(id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/get-producto/${id}`);
  }

  // ☢️ Método Trae todos los productos
  getCategorias(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/get-categorias`);
  }

  //☢️
  filtrarProductos(categoriaId: number): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/get-productos-filtro/${categoriaId}`
    );
  }

  traerMisProductos(id: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/mis-productos`, { id });
  }

  insertPedido(productData: any): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/insert-pedido`,
      productData
    );
  }
  
}
