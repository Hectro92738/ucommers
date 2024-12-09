import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductDetallePageRoutingModule } from './product-detalle-routing.module';

import { ProductDetallePage } from './product-detalle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ProductDetallePageRoutingModule
  ],
  declarations: [ProductDetallePage]
})
export class ProductDetallePageModule {}
