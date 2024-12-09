import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, AlertController, Platform } from '@ionic/angular';
import { CarritoService } from '../../services/carrito.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-resumen-pedido',
    templateUrl: './resumen-pedido.page.html',
    styleUrls: ['./resumen-pedido.page.scss'],
    standalone: false
})
export class ResumenPedidoPage implements OnInit {
  productos: any[] = [];
  Id_User: any;
  id_vendedor: any;
  currentUser: any;

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private carritoService: CarritoService,
    private AuthService: AuthService,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    // Obtener los datos desde el localStorage
    const datos = localStorage.getItem('datosCompra');
    if (datos) {
      this.productos = JSON.parse(datos);
      const producto = this.productos[0];
    }

    this.currentUser = this.AuthService.currentUserValue;
    this.Id_User = this.currentUser.id;
    // Llamar al renderizado del botón de PayPal
    this.renderPayPalButton();
  }

  // ☢️ Pago con paypal
  renderPayPalButton() {
    const totalAmount = this.getTotalConIVA();
    paypal
      .Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: totalAmount.toFixed(2),
                },
              },
            ],
          });
        },
        onApprove: (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            this.enviarProductosAlBackend();
          });
        },
        onError: (err: any) => {
          console.error('Error en el pago:', err);
          const msj =
            'Error en el pago. Por favor, inténtalo nuevamente. Si el problema persiste, contacta con soporte técnico.';
          this.router.navigate(['/rechazo'], {
            state: { mensaje: msj },
          });
        },
      })
      .render('#paypal-button-container');
  }

  // ☢️ Enviar productos al backend después de realizar el pago
  enviarProductosAlBackend() {
    this.carritoService.completarCompra(this.productos, this.Id_User).subscribe(
      (response) => {
        if (response.accion === 0) {
          this.router.navigate(['/success']);
        } else if (response.accion === 1 || response.accion === 2) {
          const msj = response.msj;
          this.router.navigate(['/rechazo'], {
            state: { mensaje: msj },
          });
        }
      },
      (error) => {
        const errorMessage =
          error.error?.msj || 'Error desconocido al completar la compra.';
        this.showAlert(errorMessage, '');
        console.error('Error al completar la compra:', error);
      }
    );
  }

  // ☢️ mostrar alerta
  async showAlert(message: string, aler: string) {
    const alert = await this.alertController.create({
      header: aler,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  getSubtotal(): number {
    const subtotal = this.productos.reduce(
      (subtotal, producto) => subtotal + producto.precio * producto.cantidad,
      0
    );
    return Math.round(subtotal * 100) / 100; // Redondeo a 2 decimales
  }

  //☢️
  getIVA(): number {
    const subtotal = this.getSubtotal();
    const tasaIVA = 0.16; // Porcentaje de IVA
    return Math.round(subtotal * tasaIVA * 100) / 100; // Redondeo a 2 decimales
  }

  //☢️
  getTotalConIVA(): number {
    let productos = this.productos;
    const subtotal = this.getSubtotal();
    const iva = this.getIVA();
    return Math.round((subtotal + iva) * 100) / 100; // Redondeo a 2 decimales
  }

  goBack() {
    this.navCtrl.back();
  }

  verUbicacion() {
    window.open('https://www.google.com/maps', '_blank');
  }
}
