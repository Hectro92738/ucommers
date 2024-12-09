import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NavController, AlertController, Platform } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { ProductsService } from '../../services/products.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.prod';
import * as Highcharts from 'highcharts';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';

@Component({
    selector: 'app-productos',
    templateUrl: './productos.page.html',
    styleUrls: ['./productos.page.scss'],
    standalone: false
})
export class ProductosPage implements OnInit {
  currentUser: any; // Almacenar los datos del usuario
  insertProductoForm!: FormGroup;
  selectedFile: File | null = null; // Variable para almacenar el archivo seleccionado
  categorias: any;
  productos: any;
  ventasXdia: any;
  Id_User: any; //guarda el id user
  urlImg: string | undefined;
  activeSection: string = 'ganancias';
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  chartOptions2: Highcharts.Options = {};

  constructor(
    private AuthService: AuthService,
    private navCtrl: NavController,
    private alertController: AlertController,
    private productsService: ProductsService,
    private formBuilder: FormBuilder
  ) {}

  //☢️ funcion q se ajecuta automaticamente al ingresar a la view
  ngOnInit() {
    this.urlImg = environment.urlImg;
    // Obtener el usuario actual
    this.currentUser = this.AuthService.currentUserValue;

    // Inicializar el formulario en el constructor
    this.insertProductoForm = this.formBuilder.group({
      nombre_producto: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', Validators.required],
      stock: ['', Validators.required],
      img: ['', Validators.required],
      categoria: ['', Validators.required],
    });

    this.currentUser = this.AuthService.currentUserValue;
    this.Id_User = this.currentUser.id;

    this.getCategorias();
    this.traerMisProductos();
  }

  // ☢️
  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      this.selectedFile = target.files[0]; // Guardar el archivo seleccionado
    } else {
      this.showAlert('No se seleccionó ningún archivo', 'Error ❌');
      this.selectedFile = null;
    }
  }

  // ☢️
  async onSubmit() {
    if (!this.selectedFile) {
      this.showAlert('Please select an image', 'Error ❌');
      return;
    }

    // objeto FormData
    const formData = new FormData();

    // Añadir los datos del formulario
    Object.keys(this.insertProductoForm.value).forEach((key) => {
      formData.append(key, this.insertProductoForm.value[key]);
    });

    // Añadir el archivo imagen
    formData.append('imagen', this.selectedFile);

    // Añadir el id producto
    formData.append('userId', this.currentUser.id);

    // Enviar los datos a través del servicio
    this.productsService.addProduct(formData).subscribe({
      next: async (response) => {
        this.showAlert(response.msj, 'Success ✅');
        this.insertProductoForm.reset(); // Reiniciar el formulario
        this.selectedFile = null; // Resetear el archivo seleccionado
      },
      error: async (response) => {
        let error = response.error;
        let msj = error.msj;
        this.showAlert(msj, 'Error ❌');
      },
    });
  }

  getCategorias() {
    // Trae las categorias de la bd
    this.productsService.getCategorias().subscribe(
      (response) => {
        this.categorias = response.categorias;
        // console.log(this.categorias);
      },
      (error) => {
        this.showAlert('Ups! Error al obtener las categorias.', 'Error ❌');
      }
    );
  }

  // Agrega un console.log para verificar la estructura de la respuesta
  traerMisProductos() {
    this.productsService.traerMisProductos(this.Id_User).subscribe(
      (response) => {
        this.ventasXdia = response.ventasXdia;
        this.productos = response.productos;
        this.updateChartData();
        this.updateChartVentasXDia();
      },
      (error) => {
        this.showAlert('Ups! Error al obtener los productos.', 'Error ❌');
      }
    );
  }

  updateChartData() {
    if (!this.productos || this.productos.length === 0) {
      console.log('No hay productos para mostrar en el gráfico.');
      return; // Detiene la ejecución si no hay productos
    }

    // Filtrar los productos con cantidad vendida mayor a 0
    const productosFiltrados = this.productos.filter(
      (producto: any) => Number(producto.cantidad_vendida) > 0
    );

    if (productosFiltrados.length === 0) {
      console.log('No hay productos con ventas registradas.');
      return; // Detiene la ejecución si no hay productos con ventas
    }

    // Ordenar los productos por cantidad vendida de mayor a menor
    const productosOrdenados = productosFiltrados.sort(
      (a: any, b: any) =>
        Number(b.cantidad_vendida) - Number(a.cantidad_vendida)
    );

    // Obtener los nombres de los productos y las cantidades vendidas
    const nombresProductos = productosOrdenados.map(
      (producto: any) => producto.nombre
    );
    const cantidadesVendidas = productosOrdenados.map(
      (producto: any) => Number(producto.cantidad_vendida) || 0
    );

    // Crear una lista de colores aleatorios para las barras
    const coloresBarras = cantidadesVendidas.map(() =>
      this.generarColorAleatorio()
    );

    this.chartOptions = {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Productos Más Vendidos',
      },
      xAxis: {
        categories: nombresProductos,
        title: {
          text: 'Productos',
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Cantidad Vendida',
        },
      },
      series: [
        {
          type: 'column',
          name: 'Ventas',
          data: cantidadesVendidas,
          colorByPoint: true, // Esto hace que cada barra tenga un color único
          colors: coloresBarras, // Asigna los colores generados
        },
      ],
    };

    // Esperar para asegurar que el contenedor esté disponible
    requestAnimationFrame(() => {
      const container = document.getElementById('productosChart');
      if (container) {
        Highcharts.chart(container, this.chartOptions);
      } else {
        console.error('El contenedor no está disponible.');
      }
    });
  }

  updateChartVentasXDia() {
    if (!this.ventasXdia || this.ventasXdia.length === 0) {
      console.log('No hay datos de ventas por día para mostrar en el gráfico.');
      return;
    }

    const fechas = this.ventasXdia.map((venta: any) => venta.fecha);
    const totalesPorDia = this.ventasXdia.map((venta: any) => venta.total_dia);

    const colorLinea = this.generarColorAleatorio();

    this.chartOptions2 = {
      chart: {
        type: 'line',
      },
      title: {
        text: 'Ventas por Día',
      },
      xAxis: {
        categories: fechas,
        title: {
          text: 'Fecha',
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Total de Ventas',
        },
      },
      series: [
        {
          type: 'line',
          name: 'Ventas por Día',
          data: totalesPorDia,
          color: colorLinea,
          lineWidth: 3,
        },
      ],
    };

    requestAnimationFrame(() => {
      const container = document.getElementById('ventasXDiaChart');
      if (container) {
        Highcharts.chart(container, this.chartOptions2);
      } else {
        console.error('El contenedor no está disponible.');
      }
    });
  }

  // Cambia la sección activa
  setActiveSection(section: string) {
    this.activeSection = section;
    if (this.activeSection === 'ganancias') {
      this.updateChartData();
      this.updateChartVentasXDia();
    }
  }

  // ☢️ Regresar a la view anterior
  goBack() {
    this.navCtrl.back();
  }

  generarColorAleatorio = () => {
    const letras = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letras[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // ☢️
  async showAlert(message: string, aler: string) {
    const alert = await this.alertController.create({
      header: aler,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
