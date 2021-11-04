import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ClienteCriteria } from '../model/cliente-criteria';
import { Observable } from 'rxjs';
import { CollectionResponse } from 'app/admin/shared/collection-response';
import { ClienteModel } from '../model/cliente-model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlService = 'v1/cliente-api';
  constructor(private http: HttpClient) {
    this.urlService = environment.apiUrl + this.urlService;
  }

  getEndPoint() {
    return this.urlService;
  }

    search(criteria: ClienteCriteria): Observable<CollectionResponse<ClienteModel>> {
      const endpoint = this.urlService +  '/search?' + criteria.getUrlParameters();
      return this.http.get<CollectionResponse<ClienteModel>>(endpoint);
    }

    create (tema: ClienteModel): Observable<ClienteModel> {
      return this.http.post<ClienteModel>(this.urlService, tema, httpOptions);
    }

    update (tema: ClienteModel): Observable<ClienteModel> {
      return this.http.put<ClienteModel>(this.urlService, tema, httpOptions);
    }

    delete (temaId: number): Observable<ClienteModel> {
      return this.http.delete<ClienteModel>(this.urlService + '/deleteById?id=' + temaId);
    }
}
