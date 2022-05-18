import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CollectionResponse } from 'app/admin/shared/collection-response';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { ActividadCriteria } from '../model/actividad-criteria';
import { ActividadModel } from '../model/actividad-model';

@Injectable({
  providedIn: 'root'
})
export class ActividadService {
  urlService = 'v1/actividad-api';
  constructor(private http: HttpClient) {
  this.urlService = environment.apiUrl + this.urlService;
}
register(data: ActividadModel): Observable<any> {
  const endPoint = this.urlService + '';
  return this.http.post<any>(endPoint, data);
}

update(data: ActividadModel): Observable<any> {
  const endPoint = this.urlService + '/update';
  return this.http.put<any>(endPoint, data);
}

search(criteria: ActividadCriteria): Observable<CollectionResponse<ActividadModel>> {
  const endpoint = this.urlService +  '/search?' + criteria.getUrlParameters();
  return this.http.get<CollectionResponse<ActividadModel>>(endpoint);
}
}
