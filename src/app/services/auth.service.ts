import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment'; 

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isMenuVisible = true; // Estado inicial del menú 

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  // BehaviorSubject almacena el último valor emitido y lo ofrece a los nuevos logeados inmediatamente.

  private isLoggedInSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(this.isAuthenticated());
  public isLoggedIn$: Observable<boolean> =
    this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser') || '{}')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  // ☢️ Método varificar si estoy autenticado
  //Este método verifica directamente si existe un token almacenado en el localStorage.
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
  
  // ☢️ Método para logearme
  login(username: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${environment.apiUrl}/login`, {
        email: username,
        password: password,
      })
      .pipe(
        tap((response) => {
          // Aqui almacenamos el token de autenticación que recibe del servidor
          localStorage.setItem('token', response.token);
          // Almacena la informacion del usuario autenticad en el local storage bajo la clave currentUser
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          // permite que otras partes de la aplicacion que estan suscritas al currentUserSubject 
          // reciban la actualización inmediata sobre quién es el usuario que está logueado.
          this.currentUserSubject.next(response.user);
          // Actualiza el BehaviorSubject llamado isLoggedInSubject para indicar que el usuario está logueado (true)
          this.isLoggedInSubject.next(true);
        })
      );
  }

  // ☢️ Método para registrar usuario
  register(formData: FormData): Observable<any> {
    // Extrae los valores directamente de formData
    const userData = {
        nombre: formData.get('nombre'),
        apellido_paterno: formData.get('apellido_paterno'),
        apellido_materno: formData.get('apellido_materno'),
        email: formData.get('email'),
        password: formData.get('password'),
        vendedor: formData.get('wantsToSell'),
        tipoGmail: formData.get('tipoGmail'),
        numberaVerificar: formData.get('numberaVerificar')
    };

    return this.http.post<any>(`${environment.apiUrl}/registro`, userData).pipe(
        tap((response) => {
            console.log('Registro exitoso:', response);
        })
    );
}

  // ☢️ Método pasra cerrar sesión
  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  // ☢️ Método varificar si estoy autenticado
  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }
  
  verificaVendedor(): boolean {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return currentUser?.tipo === 'vendedor';
  }
}
