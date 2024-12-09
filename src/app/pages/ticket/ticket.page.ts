import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { ComprasService } from '../../services/compras.service';
import { jsPDF } from 'jspdf';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { environment } from '../../../environments/environment.prod';
import { AuthService } from '../../services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-ticket',
    templateUrl: './ticket.page.html',
    styleUrls: ['./ticket.page.scss'],
    standalone: false
})
export class TicketPage implements OnInit {
  id: any;
  vendedor: any;
  productos: any[] = [];
  compra: any[] = [];
  isAndroid: boolean = false;
  currentUser: any;
  pdfUrl: any;

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private comprasService: ComprasService,
    private platform: Platform,
    private AuthService: AuthService,
    private sanitizer: DomSanitizer
  ) {
    this.isAndroid = this.platform.is('android');
  }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['idcompra']) {
      this.id = navigation.extras.state['idcompra'];
    }
    this.getProductosDeCompra();
    this.currentUser = this.AuthService.currentUserValue;
  }

  getProductosDeCompra() {
    if (!this.id) {
      console.error('El ID de la compra no está disponible.');
      return;
    }

    this.comprasService.getProductosDeCompra(this.id).subscribe(
      (response) => {
        if (response && response.productos) {
          this.productos = response.productos;
          this.compra = response.compra;
          let com = response.vendedor;
          let producto = com.producto;
          let vendedor = producto.user;
          this.vendedor = vendedor;
          this.verPDF();
        } else {
          console.error('No se encontraron productos en la respuesta.');
        }
      },
      (error) => {
        console.error('Error al obtener los productos:', error);
      }
    );
  }

  async downloadTicket() {
    const doc = new jsPDF();

    function centerText(
      text: string,
      y: number,
      marginSide: number = 50,
      marginTopBottom: number = 10,
      fontSize: number = 10
    ) {
      const pageWidth = doc.internal.pageSize.getWidth();
      const effectivePageWidth = pageWidth - marginSide * 2;
      const lines = doc.splitTextToSize(text, effectivePageWidth);

      doc.setFont('Courier', 'normal');
      doc.setFontSize(fontSize);

      lines.forEach((line: string, index: number) => { 
        const textWidth = doc.getTextWidth(line);
        const x = marginSide + (effectivePageWidth - textWidth) / 2;
        doc.text(line, x, y + index * marginTopBottom);
      });
    }

    function justifyText(
      text: string,
      y: number,
      marginSide: number = 50,
      marginTopBottom: number = 10,
      fontSize: number = 10
    ) {
      const pageWidth = doc.internal.pageSize.getWidth();
      const effectivePageWidth = pageWidth - marginSide * 2;
      const lines = doc.splitTextToSize(text, effectivePageWidth);

      doc.setFont('Courier', 'normal');
      doc.setFontSize(fontSize);

      lines.forEach((line: string, index: number) => { 
        // Dividir la línea en palabras
        const words = line.split(' ');
        const spaceWidth = doc.getTextWidth(' ');

        // Calcular la longitud total de la línea de texto
        const lineWidth = words.reduce(
          (acc, word) => acc + doc.getTextWidth(word) + spaceWidth,
          -spaceWidth
        );

        // Calcular el espacio adicional para justificar
        const extraSpace =
          (effectivePageWidth - lineWidth) / (words.length - 1);

        let x = marginSide;
        words.forEach((word) => {
          doc.text(word, x, y + index * marginTopBottom);
          x += doc.getTextWidth(word) + spaceWidth + extraSpace;
        });
      });
    }

    function adjustedJustifyText(
      text: string,
      y: number,
      marginSide: number = 50,
      marginTopBottom: number = 10,
      baseFontSize: number = 10
    ) {
      const wordCount = text.split(' ').length;
      let fontSize = baseFontSize;

      if (wordCount > 20) {
        fontSize = baseFontSize - (wordCount - 20) * 1;
        fontSize = Math.max(fontSize, 8);
      }

      const pageWidth = doc.internal.pageSize.getWidth();
      const effectivePageWidth = pageWidth - marginSide * 2;
      const lines = doc.splitTextToSize(text, effectivePageWidth);

      doc.setFont('Courier', 'normal');
      doc.setFontSize(fontSize);

      lines.forEach((line: string, index: number) => { 
        const words = line.split(' ');
        const spaceWidth = doc.getTextWidth(' ');

        const lineWidth = words.reduce(
          (acc, word) => acc + doc.getTextWidth(word) + spaceWidth,
          -spaceWidth
        );

        const extraSpace =
          (effectivePageWidth - lineWidth) / (words.length - 1);

        let x = marginSide;
        words.forEach((word) => {
          doc.text(word, x, y + index * marginTopBottom);
          x += doc.getTextWidth(word) + spaceWidth + extraSpace;
        });
      });
    }

    // Añadimos el logo
    const imgData = environment.imgData;
    const pageWidth = doc.internal.pageSize.getWidth();
    const logoWidth = 50;
    const logoX = (pageWidth - logoWidth) / 2;
    doc.addImage(imgData, 'JPEG', logoX, 10, logoWidth, 10);

    // Añadimos la dirección, datos del cliente, etc.
    justifyText('Avenida Pie de la Cuesta 2600,', 30);
    justifyText('76140 Santiago de Querétaro, Qro.', 40);
    centerText('Datos del Cliente:', 55);
    centerText(`ID: 00${this.compra[0]?.id_user}`, 65);
    justifyText(
      `Nombre: ${this.currentUser.nombre} ${this.currentUser.apellido_paterno} ${this.currentUser.apellido_materno}`,
      75
    );
    justifyText(`Fecha - hora: ${this.compra[0]?.fecha}`, 85);
    justifyText(
      `Vendedor: ${this.vendedor.nombre} ${this.vendedor.apellido_paterno} ${this.vendedor.apellido_materno}`,
      95
    );

    // Añadimos la lista de productos
    centerText('Productos:', 110);

    let yPosition = 120;
    this.productos.forEach((producto, index) => {
      adjustedJustifyText(
        `${index + 1}. ${producto.nombre} - ${producto.cantidad} x $${
          producto.precio_unitario
        } = $${producto.subtotal}`,
        yPosition
      );
      yPosition += 10;
    });

    // Añadimos subtotal, IVA y total
    const subtotal = Number(this.compra[0]?.total);
    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    justifyText(`Subtotal: $${subtotal.toFixed(2)}`, yPosition + 10);
    justifyText(`IVA: $${iva.toFixed(2)}`, yPosition + 20);
    justifyText(`Total: $${total.toFixed(2)}`, yPosition + 30);

    centerText(
      `Método de Pago: ${this.compra[0]?.metodo_pago}`,
      yPosition + 45
    );

    // Pie del ticket
    centerText('Teléfono: 123-456-7890', yPosition + 55);
    centerText('Correo: contacto@empresa.com', yPosition + 65);
    centerText(
      'Para reclamos, comuníquese al teléfono o correo proporcionado.',
      yPosition + 75
    );

    const pdfBlob = doc.output('blob');

    // Guardar PDF en el sistema de archivos y compartir
    if (this.isAndroid || this.platform.is('ios')) {
      try {
        const base64Data = await this.convertBlobToBase64(pdfBlob);

        const savedFile = await Filesystem.writeFile({
          path: 'ticket.pdf',
          data: base64Data,
          directory: Directory.Documents,
        });

        await Share.share({
          title: 'Ticket de Compra',
          text: 'Aquí tienes tu ticket de compra.',
          url: savedFile.uri,
          dialogTitle: 'Compartir Ticket',
        });
      } catch (error) {
        console.error('Error al compartir:', error);
      }
    } else {
      doc.save('ticket.pdf');
    }
  }

  async verPDF() {
    const doc = new jsPDF();
    function centerText(
      text: string,
      y: number,
      marginSide: number = 50,
      marginTopBottom: number = 10,
      fontSize: number = 10
    ) {
      const pageWidth = doc.internal.pageSize.getWidth();
      const effectivePageWidth = pageWidth - marginSide * 2;
      const lines = doc.splitTextToSize(text, effectivePageWidth);
      doc.setFont('Courier', 'normal');
      doc.setFontSize(fontSize);
      lines.forEach((line: string, index: number) => { 
        const textWidth = doc.getTextWidth(line);
        const x = marginSide + (effectivePageWidth - textWidth) / 2;
        doc.text(line, x, y + index * marginTopBottom);
      });
    }
    function justifyText(
      text: string,
      y: number,
      marginSide: number = 50,
      marginTopBottom: number = 10,
      fontSize: number = 10
    ) {
      const pageWidth = doc.internal.pageSize.getWidth();
      const effectivePageWidth = pageWidth - marginSide * 2;
      const lines = doc.splitTextToSize(text, effectivePageWidth);
      doc.setFont('Courier', 'normal');
      doc.setFontSize(fontSize);
      lines.forEach((line: string, index: number) => { 
        const words = line.split(' ');
        const spaceWidth = doc.getTextWidth(' ');
        const lineWidth = words.reduce(
          (acc, word) => acc + doc.getTextWidth(word) + spaceWidth,
          -spaceWidth
        );
        const extraSpace =
          (effectivePageWidth - lineWidth) / (words.length - 1);
        let x = marginSide;
        words.forEach((word) => {
          doc.text(word, x, y + index * marginTopBottom);
          x += doc.getTextWidth(word) + spaceWidth + extraSpace;
        });
      });
    }
    function adjustedJustifyText(
      text: string,
      y: number,
      marginSide: number = 50,
      marginTopBottom: number = 10,
      baseFontSize: number = 10
    ) {
      const wordCount = text.split(' ').length;
      let fontSize = baseFontSize;
      if (wordCount > 20) {
        fontSize = baseFontSize - (wordCount - 20) * 1;
        fontSize = Math.max(fontSize, 8);
      }
      const pageWidth = doc.internal.pageSize.getWidth();
      const effectivePageWidth = pageWidth - marginSide * 2;
      const lines = doc.splitTextToSize(text, effectivePageWidth);
      doc.setFont('Courier', 'normal');
      doc.setFontSize(fontSize);
      lines.forEach((line: string, index: number) => { 
        const words = line.split(' ');
        const spaceWidth = doc.getTextWidth(' ');
        const lineWidth = words.reduce(
          (acc, word) => acc + doc.getTextWidth(word) + spaceWidth,
          -spaceWidth
        );
        const extraSpace =
          (effectivePageWidth - lineWidth) / (words.length - 1);
        let x = marginSide;
        words.forEach((word) => {
          doc.text(word, x, y + index * marginTopBottom);
          x += doc.getTextWidth(word) + spaceWidth + extraSpace;
        });
      });
    }
    const imgData = environment.imgData;
    const pageWidth = doc.internal.pageSize.getWidth();
    const logoWidth = 50;
    const logoX = (pageWidth - logoWidth) / 2;
    doc.addImage(imgData, 'JPEG', logoX, 10, logoWidth, 10);
    justifyText('Avenida Pie de la Cuesta 2600,', 30);
    justifyText('76140 Santiago de Querétaro, Qro.', 40);
    centerText('Datos del Cliente:', 55);
    centerText(`ID: 00${this.compra[0]?.id_user}`, 65);
    justifyText(
      `Nombre: ${this.currentUser.nombre} ${this.currentUser.apellido_paterno} ${this.currentUser.apellido_materno}`,
      75
    );
    justifyText(`Fecha - hora: ${this.compra[0]?.fecha}`, 85);
    justifyText(
      `Vendedor: ${this.vendedor.nombre} ${this.vendedor.apellido_paterno} ${this.vendedor.apellido_materno}`,
      95
    );
    centerText('Productos:', 110);
    let yPosition = 120;
    this.productos.forEach((producto, index) => {
      adjustedJustifyText(
        `${index + 1}. ${producto.nombre} - ${producto.cantidad} x $${
          producto.precio_unitario
        } = $${producto.subtotal}`,
        yPosition
      );
      yPosition += 10;
    });
    const subtotal = Number(this.compra[0]?.total);
    const iva = subtotal * 0.16;
    const total = subtotal + iva;
    justifyText(`Subtotal: $${subtotal.toFixed(2)}`, yPosition + 10);
    justifyText(`IVA: $${iva.toFixed(2)}`, yPosition + 20);
    justifyText(`Total: $${total.toFixed(2)}`, yPosition + 30);
    centerText(
      `Método de Pago: ${this.compra[0]?.metodo_pago}`,
      yPosition + 45
    );
    centerText('Teléfono: 123-456-7890', yPosition + 55);
    centerText('Correo: contacto@empresa.com', yPosition + 65);
    centerText(
      'Para reclamos, comuníquese al teléfono o correo proporcionado.',
      yPosition + 75
    );
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
  }

  // Convertir Blob a Base64
  convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Regresar a la view anterior
  goBack() {
    this.navCtrl.back();
  }

}