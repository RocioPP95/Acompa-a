import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TablonPage } from './tablon.page';

describe('TablonPage', () => {
  let component: TablonPage;
  let fixture: ComponentFixture<TablonPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TablonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
