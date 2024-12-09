import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-success',
    templateUrl: './success.page.html',
    styleUrls: ['./success.page.scss'],
    standalone: false
})
export class SuccessPage implements OnInit {
  constructor() {}

  ngOnInit() {
    console.log();
  }

  carrito() {
    window.location.href = '/star/carrito';
  }
  catalogo(){
    window.location.href = '/star/home';
  }
  compras() {
    window.location.href = '/star/mis-compras';
  }
}
