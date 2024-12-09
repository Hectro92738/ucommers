import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { AuthService } from '../../services/auth.service';
import { NavController, AlertController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
  standalone: false,
})
export class CarritoPage implements OnInit {
  productos: any[] = [];
  currentUser: any; //guasda el usuario
  Id_User: any; //guarda el id user
  mensaje: any;
  urlImg: string | undefined;
  public isDesktop: boolean;
  public isTablet: boolean;
  public isMobile: boolean;

  constructor(
    private CarritoService: CarritoService,
    private alertController: AlertController,
    private AuthService: AuthService,
    private navCtrl: NavController,
    private router: Router,
    private alertCtrl: AlertController,
    private platform: Platform
  ) {
    this.isDesktop = this.platform.width() >= 1024; // Pantallas de escritorio
    this.isTablet =
      this.platform.width() >= 768 && this.platform.width() < 1024; // Pantallas de tablets
    this.isMobile = this.platform.width() < 768; // Pantallas de móviles

    this.platform.resize.subscribe(() => {
      this.checkScreenSize();
    });
  }

  ngOnInit() {
    this.urlImg = environment.urlImg;
    this.currentUser = this.AuthService.currentUserValue;
    this.Id_User = this.currentUser.id;
    this.GetCarrito();
  }

  // ☢️ Método para verificar tamaño de pantalla
  async checkScreenSize() {
    const width = this.platform.width();
    this.isDesktop = width >= 1024;
    this.isTablet = width >= 768 && width < 1024;
    this.isMobile = width < 768;
  }

  // ☢️
  async showAlert(message: string, tex: string) {
    const alert = await this.alertController.create({
      header: tex,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  //☢️
  getSubtotal(productos: any[]): number {
    const subtotal = productos.reduce(
      (subtotal, producto) => subtotal + producto.precio * producto.cantidad,
      0
    );
    return Math.round(subtotal * 100) / 100; // Redondeo a 2 decimales
  }

  //☢️
  getIVA(productos: any[]): number {
    const subtotal = this.getSubtotal(productos);
    const tasaIVA = 0.16; // Porcentaje de IVA
    return Math.round(subtotal * tasaIVA * 100) / 100; // Redondeo a 2 decimales
  }

  //☢️
  getTotalConIVA(productos: any[]): number {
    const subtotal = this.getSubtotal(productos);
    const iva = this.getIVA(productos);
    return Math.round((subtotal + iva) * 100) / 100; // Redondeo a 2 decimales
  }

  hacerPedido(producto: any, vendedor: any) {
    const productos = Array.isArray(producto) ? producto : [producto];

    productos[0].user = {
      id: vendedor.IdVendedor,
      nombre: vendedor.NombreVendedor,
    };

    const pro = JSON.stringify(productos);

    localStorage.setItem('datosCompra', pro);

    this.router.navigate(['/maps']);
  }

  hacerPedidoGrupal(productos: any, vendedor: any) {
    productos[0].user = {
      id: vendedor.IdVendedor,
      nombre: vendedor.NombreVendedor,
    };

    const pro = JSON.stringify(productos);

    localStorage.setItem('datosCompra', pro);

    this.router.navigate(['/maps']);
  }

  // ☢️ alerta de confirmación al agregar al carrito
  async confirmarEliminarCarrito(productoId: number) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que deseas eliminar del carrito?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            // console.log('El usuario canceló');
          },
        },
        {
          text: 'Eliminar ❌',
          handler: () => {
            this.eliminarDelCarrito(productoId, this.Id_User);
          },
        },
      ],
    });

    await alert.present();
  }

  async eliminarDelCarrito(ProductoId: number, IdUser: number) {
    this.CarritoService.EliminarDelCarrito(ProductoId, IdUser).subscribe(
      (response) => {
        // this.refreshPage()
        this.ionViewWillEnter();
        this.refreshPage();
        // this.GetCarrito();
      },
      (error) => {
        const errorMessage = error.error.msj;
        this.showAlert(errorMessage, 'Error ❌');
      }
    );
  }

  async GetCarrito() {
    this.CarritoService.getProductos(this.Id_User).subscribe(
      (response) => {
        // console.log(response);
        if (response.status === true) {
          // Inicializa la cantidad de cada producto
          this.productos = Object.values(response.productosPorVendedor).map(
            (vendedor: any) => {
              vendedor.productos = vendedor.productos.map((producto: any) => ({
                ...producto,
                cantidad: 1,
              }));
              return vendedor;
            }
          );

          let nuevaCantidad = response.ContadorCarrito;
          this.CarritoService.actualizarCantidad(nuevaCantidad);
        } else if (response.status === false) {
          this.productos = [];
          this.CarritoService.actualizarCantidad(0);
          this.mensaje = response.msj;
        }
      },
      (error) => {
        const errorMessage = error;
      }
    );
  }

  async refreshPage() {
    location.reload(); // Esto recarga la página actual
  }

  // ☢️ Regresar a la view anterior
  goBack() {
    this.navCtrl.back();
  }

  ionViewWillEnter() {
    this.GetCarrito();
    this.mensaje = null;
  }

  incrementarCantidad(producto: any) {
    // console.log(producto)
    if (producto.cantidad < producto.stock) {
      producto.cantidad++;
    }
  }

  decrementarCantidad(producto: any) {
    // console.log(producto)
    if (producto.cantidad > 1) {
      producto.cantidad--;
    }
  }
}
