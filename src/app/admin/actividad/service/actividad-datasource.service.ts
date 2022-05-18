import { CollectionViewer } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActividadCriteria } from '../model/actividad-criteria';
import { ActividadService } from './actividad.service';

@Injectable({
  providedIn: 'root'
})
export class ActividadDatasourceService  <ActividadModel> {
  private actividadsSubject = new BehaviorSubject<ActividadModel[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<any>({});
  private countSubject = new BehaviorSubject<number>(0);
  public counter$ = this.countSubject.asObservable();
  public loadingSubject$ = this.loadingSubject.asObservable();
  public errorSubject$ = this.errorSubject.asObservable();
  sort: any;
  paginator: any;
  public actividadsData: any;

  constructor(
    private actividadService: ActividadService) {}

  connect(collectionViewer: CollectionViewer): Observable<ActividadModel[]> {
      return this.actividadsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
      this.actividadsSubject.complete();
      this.loadingSubject.complete();
      this.countSubject.complete();
  }

  search(actividadCriteria: ActividadCriteria): void {
      this.loadingSubject.next(true);
      this.actividadService.search(actividadCriteria).subscribe((result: any) => {
          this.actividadsData = result.content;
          this.actividadsSubject.next(result.content);
          this.countSubject.next(result.totalElements);
          this.loadingSubject.next(false);
          this.errorSubject.next({ok: true});
      }, err => {
        this.actividadsData = [];
        this.actividadsSubject.next([]);
        this.countSubject.next(0);
        this.loadingSubject.next(false);
        this.errorSubject.next(err);
      });
  }
}

