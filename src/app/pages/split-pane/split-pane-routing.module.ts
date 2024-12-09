import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard'; 
import { vendedorGuard } from '../../guards/vendedor.guard'; 
import { SplitPanePage } from './split-pane.page';

const routes: Routes = [
  {
    path: '',
    component: SplitPanePage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'productos',
        canActivate: [AuthGuard, vendedorGuard],
        loadChildren: () => import('../productos/productos.module').then( m => m.ProductosPageModule)
      },
      {
        path: 'login',
        loadChildren: () => import('../login/login.module').then( m => m.LoginPageModule)
      },
      {
        path: 'grid-page',
        loadChildren: () => import('../grid-page/grid-page.module').then( m => m.GridPagePageModule)
      },
      {
        path: 'mis-datos',
        canActivate: [AuthGuard],
        loadChildren: () => import('../mis-datos/mis-datos.module').then( m => m.MisDatosPageModule)
      },
      {
        path: 'product-detalle/:id',
        canActivate: [AuthGuard],
        loadChildren: () => import('../product-detalle/product-detalle.module').then( m => m.ProductDetallePageModule)
      },
      {
        path: 'carrito',
        canActivate: [AuthGuard],
        loadChildren: () => import('../carrito/carrito.module').then( m => m.CarritoPageModule)
      },
      {
        path: 'recuperacion-pass',
        loadChildren: () => import('../recuperacion-pass/recuperacion-pass.module').then( m => m.RecuperacionPassPageModule)
      },
      {
        path: 'resumen-pedido',
        canActivate: [AuthGuard],
        loadChildren: () => import('../resumen-pedido/resumen-pedido.module').then( m => m.ResumenPedidoPageModule)
      },
      {
        path: 'mis-compras',
        canActivate: [AuthGuard],
        loadChildren: () => import('../mis-compras/mis-compras.module').then( m => m.MisComprasPageModule)
      },
      {
        path: 'detalle-compra/:id',
        canActivate: [AuthGuard],
        loadChildren: () => import('../detalle-compra/detalle-compra.module').then( m => m.DetalleCompraPageModule)
      },
      {
        path: 'success',
        canActivate: [AuthGuard],
        loadChildren: () => import('../success/success.module').then( m => m.SuccessPageModule)
      },
      {
        path: 'rechazo',
        canActivate: [AuthGuard],
        loadChildren: () => import('../rechazo/rechazo.module').then( m => m.RechazoPageModule)
      },
      {
        path: 'ticket',
        canActivate: [AuthGuard],
        loadChildren: () => import('../ticket/ticket.module').then( m => m.TicketPageModule)
      },
      {
        path: 'maps',
        canActivate: [AuthGuard],
        loadChildren: () => import('../maps/maps.module').then( m => m.MapsPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class SplitPanePageRoutingModule {}
