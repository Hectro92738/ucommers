import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController, Platform } from '@ionic/angular';
import { environment } from '../../../environments/environment.prod';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProductsService } from '../../services/products.service';
import { CarritoService } from '../../services/carrito.service';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-product-detalle',
  templateUrl: './product-detalle.page.html',
  styleUrls: ['./product-detalle.page.scss'],
  standalone: false,
})
export class ProductDetallePage implements OnInit {
  producto: any;
  productos: any[] = [];
  currentUser: any;
  Id_User: any;
  categorias: any[] = [];
  public isLargeScreen: boolean;
  urlImg: string | undefined;
  customPopoverOptions: any = {
    header: 'Selecciona la cantidad',
    subHeader: 'Elige entre 1 y el stock disponible',
    message: 'Cantidad',
  };

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private carritoService: CarritoService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private AuthService: AuthService,
    private platform: Platform,
    private router: Router,
    private spinnerService: SpinnerService
  ) {
    this.isLargeScreen = this.platform.width() >= 765;

    this.platform.resize.subscribe(() => {
      this.checkScreenSize();
    });
  }

  // ☢️ Funcion q se ejecuta al ingresar a la view
  ngOnInit() {
    this.spinnerService.hide();
    this.urlImg = environment.urlImg;
    const productId = this.route.snapshot.paramMap.get('id');
    this.cargarProducto(productId);

    this.currentUser = this.AuthService.currentUserValue;
    this.Id_User = this.currentUser.id;
  }

  // ☢️ Trae los dato s del producto
  cargarProducto(id: string | null) {
    if (id) {
      this.productsService.getProductoPorId(id).subscribe(
        (response) => {
          if (response.status == 1 || response.status == 2) {
            this.showAlert(response.msj, 'Error ❌');
            setTimeout(() => {
              window.location.href = '/star/home';
            }, 2000);
          } else {
            this.producto = response.producto;
            this.producto.cantidad = 1;
          }
        },
        (error) => {
          console.error('Error al obtener el producto:', error);
        }
      );
    }
  }

  // ☢️ alerta de confirmación al agregar al carrito
  async confirmarAgregarCarrito(productoId: number) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que deseas agregar este producto al carrito?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'Agregar',
          handler: () => {
            this.agregarCarrito(productoId, this.Id_User);
          },
        },
      ],
    });
    await alert.present();
  }

  //☢️ agrega al carrito
  agregarCarrito(productoId: number, userId: number) {
    this.spinnerService.show(); // Mostrar animación
    this.carritoService.agregarProductoAlCarrito(productoId, userId).subscribe(
      (response: any) => {
        if (response.status == 1 || response.status == 2) {
          this.showAlert(response.msj, 'Error ❌');
          setTimeout(() => {
            window.location.href = '/star/home';
          }, 1500);
        } else {
          const nuevaCantidad = response.contadorCarrito;
          this.carritoService.actualizarCantidad(nuevaCantidad);
          setTimeout(() => {
            this.spinnerService.hide();
            this.showAlert(response.msj, '');
          }, 1500);
        }
      },
      (error) => {
        setTimeout(() => {
          this.spinnerService.hide();
          const errorMessage = error.error.msj;
          this.showAlert(errorMessage, 'Error ❌');
        }, 1500);
      }
    );
  }

  // ☢️ Guardar los datos de los productos en el localStorage
  hacerPedido(producto: any) {
    let nuevoArray = [producto];
    // Guardar el nuevo array
    localStorage.setItem('datosCompra', JSON.stringify(nuevoArray));
    // this.router.navigate(['/resumen-pedido']);
    this.router.navigate(['/maps']);
  }

  // ☢️ Regresar a la view anterior
  goBack() {
    this.navCtrl.back();
  }

  //☢️
  checkScreenSize() {
    this.isLargeScreen = this.platform.width() >= 765;
  }

  // ☢️ mostrar alerta
  async showAlert(message: string, aler: string) {
    const alert = await this.alertCtrl.create({
      header: aler,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  getRange(start: number, end: number): number[] {
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }
}
