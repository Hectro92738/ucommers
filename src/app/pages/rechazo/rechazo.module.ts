import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RechazoPageRoutingModule } from './rechazo-routing.module';

import { RechazoPage } from './rechazo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RechazoPageRoutingModule
  ],
  declarations: [RechazoPage]
})
export class RechazoPageModule {}
