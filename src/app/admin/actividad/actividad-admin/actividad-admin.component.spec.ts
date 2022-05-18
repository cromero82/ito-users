import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadAdminComponent } from './actividad-admin.component';

describe('ActividadAdminComponent', () => {
  let component: ActividadAdminComponent;
  let fixture: ComponentFixture<ActividadAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActividadAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActividadAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
