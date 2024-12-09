import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-mis-datos',
    templateUrl: './mis-datos.page.html',
    styleUrls: ['./mis-datos.page.scss'],
    standalone: false
})
export class MisDatosPage implements OnInit {
  currentUser: any; // almacenar los datos del usuario

  constructor(private AuthService: AuthService) {}

  ngOnInit() {
    // Obtener el usuario actual 
    this.currentUser = this.AuthService.currentUserValue;
    // console.log('Datos del usuario:', this.currentUser);
  }
}