import { TestBed } from '@angular/core/testing';

import { ActividadDatasourceService } from './actividad-datasource.service';

describe('ActividadDatasourceService', () => {
  let service: ActividadDatasourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActividadDatasourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
