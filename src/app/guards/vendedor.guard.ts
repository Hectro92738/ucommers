import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: 'root',
})
export class vendedorGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.verificaVendedor()) {
      return true;
    } else {
      this.router.navigate(['star/home']); // Redirige al home
      return false;
    }
  }
}
