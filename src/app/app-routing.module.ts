import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'star/home',
    pathMatch: 'full',
  },
  {
    path: 'star',
    loadChildren: () =>
      import('./pages/split-pane/split-pane.module').then(
        (m) => m.SplitPanePageModule
      ),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./pages/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: 'productos',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/productos/productos.module').then((m) => m.ProductosPageModule),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'grid-page',
    loadChildren: () => import('./pages/grid-page/grid-page.module').then( m => m.GridPagePageModule)
  },
  {
    path: 'mis-datos',
    canActivate: [AuthGuard], 
    loadChildren: () => import('./pages/mis-datos/mis-datos.module').then( m => m.MisDatosPageModule)
  },
  {
    path: 'product-detalle/:id',
    canActivate: [AuthGuard], 
    loadChildren: () => import('./pages/product-detalle/product-detalle.module').then( m => m.ProductDetallePageModule)
  },
  {
    path: 'carrito',
    canActivate: [AuthGuard], 
    loadChildren: () => import('./pages/carrito/carrito.module').then( m => m.CarritoPageModule)
  },
  {
    path: 'recuperacion-pass',
    loadChildren: () => import('./pages/recuperacion-pass/recuperacion-pass.module').then( m => m.RecuperacionPassPageModule)
  },
  {
    path: 'resumen-pedido',
    canActivate: [AuthGuard], 
    loadChildren: () => import('./pages/resumen-pedido/resumen-pedido.module').then( m => m.ResumenPedidoPageModule)
  },
  {
    path: 'mis-compras',
    canActivate: [AuthGuard], 
    loadChildren: () => import('./pages/mis-compras/mis-compras.module').then( m => m.MisComprasPageModule)
  },
  {
    path: 'detalle-compra/:id',
    canActivate: [AuthGuard], 
    loadChildren: () => import('./pages/detalle-compra/detalle-compra.module').then( m => m.DetalleCompraPageModule)
  },
  {
    path: 'success',
    canActivate: [AuthGuard], 
    loadChildren: () => import('./pages/success/success.module').then( m => m.SuccessPageModule)
  },
  {
    path: 'ticket',
    canActivate: [AuthGuard], 
    loadChildren: () => import('./pages/ticket/ticket.module').then( m => m.TicketPageModule)
  },
  {
    path: 'rechazo',
    canActivate: [AuthGuard], 
    loadChildren: () => import('./pages/rechazo/rechazo.module').then( m => m.RechazoPageModule)
  },
  {
    path: 'maps',
    canActivate: [AuthGuard], 
    loadChildren: () => import('./pages/maps/maps.module').then( m => m.MapsPageModule)
  },
  {
    path: 'pedidos',
    loadChildren: () => import('./pages/pedidos/pedidos.module').then( m => m.PedidosPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
