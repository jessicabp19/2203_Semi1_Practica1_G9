import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraerTextoComponent } from './extraer-texto.component';

describe('ExtraerTextoComponent', () => {
  let component: ExtraerTextoComponent;
  let fixture: ComponentFixture<ExtraerTextoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtraerTextoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraerTextoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
