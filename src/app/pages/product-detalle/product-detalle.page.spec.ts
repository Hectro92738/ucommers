import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDetallePage } from './product-detalle.page';

describe('ProductDetallePage', () => {
  let component: ProductDetallePage;
  let fixture: ComponentFixture<ProductDetallePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
