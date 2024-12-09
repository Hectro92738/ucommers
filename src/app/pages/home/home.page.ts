import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { AlertController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.prod';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
    standalone: false
})
export class HomePage implements OnInit {
  productos: any[] = [];
  categorias: any[] = [];
  isModalOpen = false;
  public isLargeScreen: boolean;
  urlImg: string | undefined;

  constructor(
    private ProductsService: ProductsService,
    private alertController: AlertController,
    private router: Router,
    private platform: Platform
  ) {
    this.isLargeScreen = this.platform.width() >= 765;

    this.platform.resize.subscribe(() => {
      this.checkScreenSize();
    });
  }

  ngOnInit() {
    this.urlImg = environment.urlImg;
    // Trae todos los productos
    this.ProductsService.getProductos().subscribe(
      (response) => {
        this.productos = response.productos;
      },
      (error) => {
        this.showAlert('Ups! Error al obtener los productos.', 'Error ❌');
      }
    );

    // Trae las categorias de la bd
    this.ProductsService.getCategorias().subscribe(
      (response) => {
        this.categorias = response.categorias;
        // console.log(this.categorias);
      },
      (error) => {
        this.showAlert('Ups! Error al obtener las categorias.', 'Error ❌');
      }
    );
  }

  // ☢️ detalle del producto
  verDetalleProducto(productId: number) {
    this.router.navigate(['star/product-detalle', productId]);
  }

  // ☢️ detalle del producto
  filtroProductos(categoriaId: number) {
    // console.log(categoriaId)
    this.ProductsService.filtrarProductos(categoriaId).subscribe(
      (response: any) => {
        this.productos = response.productos;
        // console.log(this.productos)
      },
      (error: any) => {
        const errorMessage = error.error.msj ;
        this.showAlert(errorMessage, 'Error ❌');
      }
    );
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

  checkScreenSize() {
    this.isLargeScreen = this.platform.width() >= 765;
  }
  
  ionViewWillEnter() {

  }

  
}

/**
  productosXD = [*
    {
      nombre: 'Lápiz Escolar HB',
      precio: 12.00,
      descuento: 5,
      descripcion: 'Paquete de 10 lápices escolares con goma.',
      imagen: 'assets/img_all/cigarro.png',
    },
    {
      nombre: 'Cuaderno Profesional 100 Hojas',
      precio: 25.00,
      descuento: 10,
      descripcion: 'Cuaderno tamaño carta con 100 hojas rayadas.',
      imagen: 'assets/img_all/cuaderno.jpg',
    },
    {
      nombre: 'Mochila Escolar',
      precio: 399.00,
      descuento: 15,
      descripcion: 'Mochila resistente con múltiples compartimientos.',
      imagen: 'assets/img_all/mochila.jpg',
    },
    {
      nombre: 'Bolígrafo Gel Azul',
      precio: 8.00,
      descuento: 5,
      descripcion: 'Bolígrafo con tinta de gel azul, suave escritura.',
      imagen: 'assets/img_all/lapiz.jpg',
    },
    {
      nombre: 'Tijeras Escolares',
      precio: 20.00,
      descuento: 12,
      descripcion: 'Tijeras con puntas redondeadas para seguridad.',
      imagen: 'assets/img_all/tijeras.jpg',
    },
    {
      nombre: 'Goma Borradora',
      precio: 5.00,
      descuento: 5,
      descripcion: 'Borrador suave para lápiz.',
      imagen: 'assets/img_all/borrador.jpg',
    },
    {
      nombre: 'Calculadora Científica',
      precio: 150.00,
      descuento: 10,
      descripcion: 'Calculadora con funciones avanzadas.',
      imagen: 'assets/img_all/calculadora.jpg',
    },
    {
      nombre: 'Regla de 30 cm',
      precio: 10.00,
      descuento: 5,
      descripcion: 'Regla plástica transparente de 30 cm.',
      imagen: 'assets/img_all/regla.jpg',
    },
    {
      nombre: 'Pegamento en Barra',
      precio: 15.00,
      descuento: 7,
      descripcion: 'Pegamento en barra ideal para manualidades.',
      imagen: 'assets/img_all/pegamento.jpg',
    },
    {
      nombre: 'Coca Cola 600ml',
      precio: 18.00,
      descuento: 5,
      descripcion: 'Bebida refrescante Coca Cola de 600ml.',
      imagen: 'assets/img_all/cocacola.jpg',
    },
    {
      nombre: 'Hamburguesa Clásica',
      precio: 60.00,
      descuento: 10,
      descripcion: 'Hamburguesa clásica con queso y papas fritas.',
      imagen: 'assets/img_all/hamburgesa.jpg',
    },
    {
      nombre: 'Papas Sabritas 45g',
      precio: 16.00,
      descuento: 8,
      descripcion: 'Bolsa de papas fritas Sabritas sabor original.',
      imagen: 'assets/img_all/papas.jpg',
    },
    {
      nombre: 'Pizza Individual',
      precio: 75.00,
      descuento: 12,
      descripcion: 'Pizza individual con queso y peperoni.',
      imagen: 'assets/img_all/piza.jpg',
    },
    {
      nombre: 'Café Americano',
      precio: 25.00,
      descuento: 5,
      descripcion: 'Café americano grande.',
      imagen: 'assets/img_all/cafe.jpg',
    },
    {
      nombre: 'Torta de Jamón',
      precio: 30.00,
      descuento: 10,
      descripcion: 'Torta clásica de jamón y queso.',
      imagen: 'assets/img_all/tortas.jpg',
    },
    {
      nombre: 'Agua Mineral 500ml',
      precio: 12.00,
      descuento: 5,
      descripcion: 'Agua mineral con gas de 500ml.',
      imagen: 'assets/img_all/mineral.jpg',
    },
    {
      nombre: 'Hot Dog',
      precio: 35.00,
      descuento: 10,
      descripcion: 'Hot dog clásico con salchicha y aderezos.',
      imagen: 'assets/img_all/hotdoc.jpg',
    },
    {
      nombre: 'Tacos de Pastor',
      precio: 50.00,
      descuento: 15,
      descripcion: 'Orden de 5 tacos de pastor con salsa y limón.',
      imagen: 'assets/img_all/pastor.jpg',
    },
    {
      nombre: 'Nachos con Queso',
      precio: 40.00,
      descuento: 10,
      descripcion: 'Nachos con queso fundido.',
      imagen: 'assets/img_all/nachos.jpg',
    },
    {
      nombre: 'Refresco Sprite 600ml',
      precio: 18.00,
      descuento: 5,
      descripcion: 'Refresco Sprite de 600ml.',
      imagen: 'assets/img_all/sprite.jpg',
    },
    {
      nombre: 'Calculadora Científica',
      precio: 150.00,
      descuento: 10,
      descripcion: 'Calculadora con funciones avanzadas.',
      imagen: 'assets/img_all/calculadora.jpg',
    },
  ];

 */
