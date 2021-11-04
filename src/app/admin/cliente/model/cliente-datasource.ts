import { BehaviorSubject, Observable } from "rxjs";
import { CollectionViewer } from "@angular/cdk/collections";
import { ClienteCriteria } from "../model/cliente-criteria";
import { ClienteService } from "../service/cliente.service";

export class ClienteDatasource  <ClienteModel> {
  private clientesSubject = new BehaviorSubject<ClienteModel[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<any>({});
  private countSubject = new BehaviorSubject<number>(0);
  public counter$ = this.countSubject.asObservable();
  public loadingSubject$ = this.loadingSubject.asObservable();
  public errorSubject$ = this.errorSubject.asObservable();
  sort: any;
  paginator: any;
  public clientesData: any;

  constructor(
    private clienteService: ClienteService) {}

  connect(collectionViewer: CollectionViewer): Observable<ClienteModel[]> {
      return this.clientesSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
      this.clientesSubject.complete();
      this.loadingSubject.complete();
      this.countSubject.complete();
  }

  search(clienteCriteria: ClienteCriteria): void {
      this.loadingSubject.next(true);
      this.clienteService.search(clienteCriteria).subscribe((result: any) => {
          this.clientesData = result.content;
          this.clientesSubject.next(result.content);
          this.countSubject.next(result.totalElements);
          this.loadingSubject.next(false);
          this.errorSubject.next({ok: true});
      }, err => {
        this.clientesData = [];
        this.clientesSubject.next([]);
        this.countSubject.next(0);
        this.loadingSubject.next(false);
        this.errorSubject.next(err);
      });
  }
}

