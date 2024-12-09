import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.prod';
import { SpinnerService } from '../../services/spinner.service';
import { AuthService } from '../../services/auth.service';
import { ComprasService } from '../../services/compras.service';
import { Base64Service } from '../../services/base64.service';

@Component({
    selector: 'app-mis-compras',
    templateUrl: './mis-compras.page.html',
    styleUrls: ['./mis-compras.page.scss'],
    standalone: false
})
export class MisComprasPage implements OnInit {
  urlImg: string | undefined;
  currentUser: any;
  Id_User: any;
  compras: any[] = [];

  public isDesktop: boolean;
  public isTablet: boolean;
  public isMobile: boolean;

  constructor(
    private navCtrl: NavController,
    private spinnerService: SpinnerService,
    private authService: AuthService,
    private router: Router,
    private comprasService: ComprasService,
    private base64Service: Base64Service,
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
    // -----
    this.currentUser = this.authService.currentUserValue;
    this.Id_User = this.currentUser.id;
    // console.log(this.Id_User)
    this.getMisCompras();
  }

  // ☢️ Regresar a la view anterior
  goBack() {
    this.navCtrl.back();
  }

  // ☢️ trae las compras
  getMisCompras() {
    this.spinnerService.show();
    this.comprasService.getMisCompras(this.Id_User).subscribe(
      (response) => {
        this.compras = response.compras;
        this.spinnerService.hide();
      },
      (error) => {
        this.spinnerService.hide();
        console.error(error);
      }
    );
  }

  detalleCompra(id: number) {
    const encodedId = this.base64Service.encode(id.toString());
    this.router.navigate([`/star/detalle-compra/${encodedId}`]);
  }

  pageTicket(id: number) {
    const idcompra = id;
    this.router.navigate(['/ticket'], {
      state: { idcompra: idcompra },
    });
  }

  // ☢️ formatear de fechas
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    return new Intl.DateTimeFormat('es-ES', options)
      .format(date)
      .replace(/\.|,/g, '');
  }

  // ☢️ detalle del producto
  verDetalleProducto(productId: number) {
    this.router.navigate(['star/product-detalle', productId]);
  }

  // ☢️ Método para verificar tamaño de pantalla
  async checkScreenSize() {
    const width = this.platform.width();
    this.isDesktop = width >= 1024;
    this.isTablet = width >= 768 && width < 1024;
    this.isMobile = width < 768;
  }

  calculartotal(total: any): number {
    total = Number(total);
    const iva = 0.16;
    const ivaAmount = total * iva;
    const totalConIva = total + ivaAmount;
    return Number(totalConIva.toFixed(2));
  }

  calculariva(total: any): number {
    total = Number(total);
    const iva = 0.16;
    const ivaAmount = total * iva;
    return Number(ivaAmount.toFixed(2));
  }
}
