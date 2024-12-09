import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController, Platform } from '@ionic/angular';
import { Base64Service } from '../../services/base64.service';
import { ComprasService } from '../../services/compras.service';
import { environment } from '../../../environments/environment.prod';

@Component({
    selector: 'app-detalle-compra',
    templateUrl: './detalle-compra.page.html',
    styleUrls: ['./detalle-compra.page.scss'],
    standalone: false
})
export class DetalleCompraPage implements OnInit {
  id: any;
  productos: any[] = []; 
  urlImg: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private base64Service: Base64Service,
    private comprasService: ComprasService
  ) {}

  ngOnInit() {
    this.urlImg = environment.urlImg;
    const encodedId: string | null = this.route.snapshot.paramMap.get('id');
    if (encodedId) {
      this.id = parseInt(this.base64Service.decode(encodedId), 10);
      this.getProductosDeCompra();
    } else {
      console.error('No se pudo obtener el ID de la compra.');
    }
  }

  // ☢️ Obtener los productos de la compra
  getProductosDeCompra() {
    if (!this.id) {
      console.error('El ID de la compra no está disponible.');
      return;
    }

    this.comprasService.getProductosDeCompra(this.id).subscribe(
      (response) => {
        if (response && response.productos) {
          this.productos = response.productos;
        } else {
          console.error('No se encontraron productos en la respuesta.');
        }
      },
      (error) => {
        console.error('Error al obtener los productos:', error);
      }
    );
  }

  // ☢️ Regresar a la view anterior
  goBack() {
    this.navCtrl.back();
  }
}
