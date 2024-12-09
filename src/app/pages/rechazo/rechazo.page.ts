import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-rechazo',
    templateUrl: './rechazo.page.html',
    styleUrls: ['./rechazo.page.scss'],
    standalone: false
})
export class RechazoPage implements OnInit {
  msj: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['mensaje']) {
      this.msj = navigation.extras.state['mensaje'];
    }
  }

  carrito() {
    window.location.href = '/star/carrito';
  }
  catalogo() {
    window.location.href = '/star/home';
  }
  compras() {
    window.location.href = '/star/mis-compras';
  }
}
