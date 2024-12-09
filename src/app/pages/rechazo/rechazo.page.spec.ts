import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RechazoPage } from './rechazo.page';

describe('RechazoPage', () => {
  let component: RechazoPage;
  let fixture: ComponentFixture<RechazoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RechazoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
