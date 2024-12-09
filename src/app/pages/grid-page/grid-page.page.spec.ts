import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GridPagePage } from './grid-page.page';

describe('GridPagePage', () => {
  let component: GridPagePage;
  let fixture: ComponentFixture<GridPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GridPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
