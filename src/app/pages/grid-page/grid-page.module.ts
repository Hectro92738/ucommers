import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GridPagePageRoutingModule } from './grid-page-routing.module';

import { GridPagePage } from './grid-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GridPagePageRoutingModule
  ],
  declarations: [GridPagePage]
})
export class GridPagePageModule {}
