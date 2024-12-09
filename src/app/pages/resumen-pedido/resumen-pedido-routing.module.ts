import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResumenPedidoPage } from './resumen-pedido.page';

const routes: Routes = [
  {
    path: '',
    component: ResumenPedidoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResumenPedidoPageRoutingModule {}
