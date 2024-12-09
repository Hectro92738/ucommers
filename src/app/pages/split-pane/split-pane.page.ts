import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertController, Platform, MenuController } from '@ionic/angular';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { ProductsService } from '../../services/products.service';
import { CarritoService } from '../../services/carrito.service';
import { SpinnerService } from '../../services/spinner.service';

@Component({
    selector: 'app-split-pane',
    templateUrl: './split-pane.page.html',
    styleUrls: ['./split-pane.page.scss'],
    animations: [
        trigger('slideInRight', [
            transition(':enter', [
                style({ transform: 'translateX(100%)', opacity: 0 }),
                animate('500ms ease-in', style({ transform: 'translateX(0)', opacity: 1 })),
            ]),
        ]),
    ],
    standalone: false
})
export class SplitPanePage implements OnInit {
  pagesWeb = [
    {
      title: 'Home',
      url: './home',
      icon: 'home',
      tipo: ['comprador', 'vendedor', 'administrador'],
      authRequired: false,
    },
    {
      title: 'mis compras',
      url: './mis-compras',
      icon: 'bag-check-outline',
      tipo: ['comprador', 'vendedor', 'administrador'],
      authRequired: true,
    },
    {
      title: 'Mis productos',
      url: './productos',
      icon: 'logo-tux',
      tipo: ['vendedor'],
      authRequired: true,
    },
  ];

  pagesAll = [
    {
      title: 'Ayuda',
      url: './ayuda',
      icon: 'help-outline',
      tipo: ['comprador', 'vendedor', 'administrador'],
      authRequired: false,
    },
    {
      title: 'Configuraciones',
      url: './configuraciones',
      icon: 'settings-sharp',
      tipo: ['comprador', 'vendedor', 'administrador'],
      authRequired: true,
    },
    {
      title: 'Mis datos',
      url: './mis-datos',
      icon: 'person-circle-outline',
      tipo: ['comprador', 'vendedor', 'administrador'],
      authRequired: true,
    },
  ];

  productos: any[] = [];
  selectedPath = '';
  public isLargeScreen: boolean;
  public isLoggedIn: boolean = false;
  currentUser: any; // almacenar los datos del usuario

  cantidadProductosCarrito: number = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController,
    private platform: Platform,
    private carritoService: CarritoService,
    private menuCtrl: MenuController,
    private ProductsService: ProductsService,
    private spinnerService: SpinnerService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.selectedPath = event.url;
      }
    });

    this.isLargeScreen = this.platform.width() >= 765;

    this.platform.resize.subscribe(() => {
      this.checkScreenSize();
    });
  }

  // Observable: isLoggedIn$ emite valores que representan el estado de autenticación del usuario (es decir, si el usuario está o no logueado).
  // Actualización del estado: Cada vez que el observable emite un nuevo valor, la función de callback se ejecuta, actualizando la propiedad isLoggedIn con el valor actual (true o false). Esto permite que el componente responda a cambios en el estado de autenticación.
  ngOnInit() {
    // Suscribirse al observable para recibir actualizaciones automáticas
    this.carritoService.cantidadProductos$.subscribe((cantidad) => {
      this.cantidadProductosCarrito = cantidad;
    });

    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });

    // Obtener el usuario actual
    this.currentUser = this.authService.currentUserValue;
  }

  checkScreenSize() {
    this.isLargeScreen = this.platform.width() >= 765;
  }
  async logout() {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {},
        },
        {
          text: 'Cerrar Sesión',
          handler: () => {
            this.closeMenu();
            this.authService.logout();
            this.router.navigate(['star/home'], { replaceUrl: true });
          },
        },
      ],
    });

    await alert.present();
  }
  refreshProductos() {
    this.ProductsService.getProductos().subscribe(
      (response) => {
        this.productos = response.productos;
      },
      (error) => {
        this.showAlert('Error al obtener los productos.', 'Error');
      }
    );
  }
  async showAlert(message: string, tex: string) {
    const alert = await this.alertController.create({
      header: tex,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }
  // Función para abrir el menú lateral
  openMenu() {
    this.menuCtrl.open('main-menu');
  }

  closeMenu() {
    this.menuCtrl.close('main-menu'); // Asegúrate de usar el menuId correcto
  }
}
/*

import { Component, OnInit } from '@angular/core';
import {NavigationEnd, Router, RouterEvent} from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-split-pane',
  templateUrl: './split-pane.page.html',
  styleUrls: ['./split-pane.page.scss'],
})
export class SplitPanePage implements OnInit {
  pages = [
    {
      title: 'Inicio',
      url: '/',
    },
    {
      title: 'Mis certificados',
      url: './mis-certificados',
    },
  ];
  selectedPath = '';
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd){
        this.selectedPath = event.url;
      }
    });
  }

  ngOnInit() {
  }

  logout() {
    this.authService.logout(); // Llama al método 'logout' del servicio de autenticación
    this.router.navigate(['/login']); // Navega a la página de inicio de sesión
  }

}

*/
