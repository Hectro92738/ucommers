import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, Platform } from '@ionic/angular';
import { Capacitor, Plugins } from '@capacitor/core';
import * as L from 'leaflet';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeolocationService } from '../../services/geolocation.service';
import { ProductsService } from '../../services/products.service';

const { Geolocation } = Plugins;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnInit {
  minDate: string = '2023-01-01T00:00:00.000Z'; // Fecha mínima válida
  maxDate: string = '2023-12-31T23:59:59.999Z'; // Fecha máxima válida
  currentDate: string = new Date().toISOString(); // Fecha actual en formato ISO

  productos: any[] = [];
  map!: L.Map;
  msj: any;
  id_vendedor: any;
  lat_vendedor: any;
  long_vendedor: any;
  lugarEntrega: FormGroup;

  // Coordenadas del polígono que delimita la universidad
  universityPolygon: L.LatLngExpression[] = [
    [20.653736, -100.407414],
    [20.653189, -100.403841],
    [20.658591, -100.402843],
    // [20.651511, -100.393678],
    // [20.656959, -100.392741],
    [20.659159, -100.406234],
  ];

  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private router: Router,
    private platform: Platform,
    private geolocationService: GeolocationService,
    private productsService: ProductsService
  ) {
    this.lugarEntrega = this.formBuilder.group({
      building: ['', Validators.required],
      paymentType: ['', Validators.required],
      dia: [new Date().toISOString().split('T')[0]], // Fecha actual
      hora: [new Date().toISOString().split('T')[1].substr(0, 5)], // Hora actual (hh:mm)
    });
  }

  ngOnInit() {
    this.initPage();
  }

  initPage() {
    this.productosAcomprar();
    this.loadMap();
  }

  productosAcomprar() {
    const datos = localStorage.getItem('datosCompra');
    if (datos) {
      let productos = JSON.parse(datos);
      console.log(productos)
      this.productos = productos;
      let producto = productos[0];
      let Idvendedor = producto.user.id;
      this.id_vendedor = Idvendedor;
    }
  }

  async loadMap() {
    this.msj = null;
    // Destruir el mapa si ya existe
    if (this.map) {
      this.map.off();
      this.map.remove();
    }
    // Configurar la ruta a los íconos de Leaflet desde URLs
    const iconRetinaUrl =
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png';
    const iconUrl =
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png';
    const shadowUrl =
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png';

    L.Icon.Default.mergeOptions({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
    });

    const coordinates = await this.getCurrentLocation();

    // Inicializar el mapa solo si las coordenadas son válidas
    if (coordinates.latitude !== 0 && coordinates.longitude !== 0) {
      this.map = L.map('map').setView(
        [coordinates.latitude, coordinates.longitude],
        13
      );

      // Cargar tiles del mapa
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(this.map);

      // Dibujar el polígono alrededor de la universidad
      const polygon = L.polygon(this.universityPolygon, {
        color: 'red',
        fillOpacity: 0.4,
      }).addTo(this.map);

      // Agregar marcador para la ubicación actual
      L.marker([coordinates.latitude, coordinates.longitude])
        .addTo(this.map)
        .bindPopup('¡Estás aquí!')
        .openPopup();

      this.geolocationService.getUbicacionVendedor(this.id_vendedor).subscribe(
        (response) => {
          this.lat_vendedor = response.latitud;
          this.long_vendedor = response.longitud;
          L.marker([this.lat_vendedor, this.long_vendedor])
            .addTo(this.map)
            .bindPopup('Vendedor')
            .openPopup();
        },
        (error) => {
          this.showAlert(
            `Ups! Error al obtener la ubicación del vendedor - ${error}`,
            'Error ❌'
          );
        }
      );

      // Verificar si la ubicación actual está dentro del polígono
      const point = L.latLng(coordinates.latitude, coordinates.longitude);
      if (polygon.getBounds().contains(point)) {
        this.msj = null;
      } else {
        this.msj =
          'Ups..! Estás fuera del área de la universidad. No puedes realizar compras.';
        return;
      }

      const point_v = L.latLng(this.lat_vendedor, this.long_vendedor);
      if (polygon.getBounds().contains(point_v)) {
        this.msj = null;
      } else {
        this.msj =
          'Ups..! El vendedor está fuera del área permitida de la universidad. No puedes realizar ventas.';
        return;
      }
    } else {
      this.showAlert('Las coordenadas obtenidas no son válidas.', 'Error');
      console.error('Las coordenadas obtenidas no son válidas.');
    }
  }

  async getCurrentLocation() {
    if (Capacitor.isNative) {
      try {
        // Solicitar permisos de geolocalización en dispositivos móviles
        const hasPermission = await Geolocation['requestPermissions']();

        if (
          hasPermission['location'] === 'granted' ||
          hasPermission['coarseLocation'] === 'granted'
        ) {
          // Obtener la posición
          const position = await Geolocation['getCurrentPosition']();
          // console.log(position);
          return {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
        } else {
          this.showAlert('Permisos de geolocalización denegados.', 'Error');
          console.error('Permisos de geolocalización denegados.');
          return { latitude: 20.654591, longitude: -100.404572 };
        }
      } catch (error) {
        this.showAlert('Error obteniendo la ubicación: ' + error, 'Error');
        console.error('Error obteniendo la ubicación:', error);
        return { latitude: 20.654591, longitude: -100.404572 };
      }
    } else {
      // Usar la API de Geolocation de HTML5 en la web
      return new Promise<{ latitude: number; longitude: number }>(
        (resolve, reject) => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                // console.log(position);
                resolve({
                  latitude: 20.654591,
                  longitude: -100.404572,
                });
              },
              (error) => {
                this.showAlert(
                  'Error obteniendo la ubicación: ' + error.message,
                  'Error'
                );
                console.error('Error obteniendo la ubicación:', error);
                return { latitude: 20.654591, longitude: -100.404572 };
              }
            );
          } else {
            this.showAlert(
              'Geolocalización no soportada por el navegador.',
              'Error'
            );
            console.error('Geolocalización no soportada por el navegador.');
            resolve({ latitude: 0, longitude: 0 });
          }
        }
      );
    }
  }

  onSubmit() {
    if (this.lugarEntrega.valid) {
      const formData = this.lugarEntrega.value;
      const productData = {
        building: formData.building,
        paymentType: formData.paymentType,
        dia: formData.dia,
        hora: formData.hora,
        productos: this.productos,
      };

      console.log('Datos enviados:', productData); // Revisa la estructura del objeto

      // Enviar datos al servicio
      this.productsService.insertPedido(productData).subscribe(
        (response) => {
          this.showAlert('Formulario enviado correctamente.', 'Success ✅');
        },
        (error) => {
          this.showAlert(
            'Ocurrió un error al enviar el formulario.',
            'Error ❌'
          );
        }
      );
    }
  }

  hacerPedido() {
    this.router.navigate(['/resumen-pedido']);
  }

  // Mostrar alerta
  async showAlert(message: string, header: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  onDateChange(event: any, controlName: string) {
    const value = event.detail.value;
    this.lugarEntrega.patchValue({ [controlName]: value });
  }

  goBack() {
    this.navCtrl.back();
  }
}
