import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RechazoPage } from './rechazo.page';

const routes: Routes = [
  {
    path: '',
    component: RechazoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RechazoPageRoutingModule {}
