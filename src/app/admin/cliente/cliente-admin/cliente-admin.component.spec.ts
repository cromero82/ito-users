import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteAdminComponent } from './cliente-admin.component';

describe('ClienteAdminComponent', () => {
  let component: ClienteAdminComponent;
  let fixture: ComponentFixture<ClienteAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClienteAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
