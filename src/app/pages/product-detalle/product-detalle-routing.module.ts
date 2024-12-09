import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductDetallePage } from './product-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: ProductDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductDetallePageRoutingModule {}
