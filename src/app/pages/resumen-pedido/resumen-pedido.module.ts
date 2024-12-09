import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResumenPedidoPageRoutingModule } from './resumen-pedido-routing.module';

import { ResumenPedidoPage } from './resumen-pedido.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResumenPedidoPageRoutingModule
  ],
  declarations: [ResumenPedidoPage]
})
export class ResumenPedidoPageModule {}
