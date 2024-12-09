import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResumenPedidoPage } from './resumen-pedido.page';

describe('ResumenPedidoPage', () => {
  let component: ResumenPedidoPage;
  let fixture: ComponentFixture<ResumenPedidoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumenPedidoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
