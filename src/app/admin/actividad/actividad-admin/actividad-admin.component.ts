import { ActividadDatasourceService } from './../service/actividad-datasource.service';
import { ActividadCriteria } from './../model/actividad-criteria';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatDialogConfig } from '@angular/material';
import { Router } from '@angular/router';
import { CONSTANTS_SHARED } from 'app/admin/shared/constants-shared';
import { TempDataService } from 'app/admin/shared/services/temp-data.service';
import { UtilitiesService } from 'app/admin/shared/services/utilities.service';
import { tap } from 'rxjs/operators';
import { ActividadEditComponent } from '../actividad-edit/actividad-edit.component';
import { ActividadModel } from '../model/actividad-model';
import { ActividadService } from '../service/actividad.service';

@Component({
  selector: 'app-actividad-admin',
  templateUrl: './actividad-admin.component.html',
  styleUrls: ['./actividad-admin.component.css']
})
export class ActividadAdminComponent implements OnInit, AfterViewInit {
  titulo = 'Gestión de actividades';
  MyDataSource: any;
  ActividadCriteria: ActividadCriteria = new ActividadCriteria();
  Actividad: ActividadModel = new ActividadModel();
  displayedColumns = [
      'nombre',
      'status',
      'actions'
  ];
  
  filterForm: FormGroup;

  @ViewChild(MatPaginator, { static: false })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false })
  sort: MatSort = new MatSort;

  usuarioDatasource: ActividadDatasourceService<ActividadModel>;
  loading = true;
  constants = CONSTANTS_SHARED;
  disabledButton = false;

  constructor(
    private userService: ActividadService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private utilitiesService: UtilitiesService,
    private tempDataService: TempDataService,
    private router: Router,
    private formBuilder: FormBuilder
    ) {}

  ngOnInit() {
      // const grupoSerializado =  this.tempDataService.getDataNivel1();
      this.usuarioDatasource = new ActividadDatasourceService(this.userService);
      this.initForm();
  }

  initForm() {
   this.filterForm = this.formBuilder.group({
    'nombre': [null, null],
    'status': [null, null]
    });

  }

  ngAfterViewInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
      this.usuarioDatasource.loadingSubject$.subscribe( (_loading: boolean) => {
          this.loading = _loading;
      });

      this.paginator.page.pipe(tap(() => this.searchData())).subscribe();
      this.sort.sortChange.subscribe((dir: any) => {
          this.searchData();
      });
      this.usuarioDatasource.errorSubject$.subscribe( (resultError: any) => {
        if ( resultError.ok !== undefined && resultError.ok === false) {
          this.utilitiesService.actionErrorMessages(resultError, this.snackBar);
        }
      });
      this.searchData();
  }

  searchData(): void {
      this.ActividadCriteria.setTableElements(this.paginator, this.sort);
      this.usuarioDatasource.sort = this.sort;
      this.usuarioDatasource.paginator = this.paginator;
      
      this.asignarFiltrosACriterios();

      this.usuarioDatasource.search(this.ActividadCriteria);
  }

  asignarFiltrosACriterios(): void {
    if(this.filterForm.get('nombre')?.value != null){
      this.ActividadCriteria.nombre = this.filterForm.get('nombre')?.value;
    }
  }

  create(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const newActividad = new ActividadModel();
    const dataParam = {
      itemData: newActividad
    };
    dialogConfig.data = dataParam;

    const dialogRef = this.dialog.open(ActividadEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (val: any) => {
        if (val) {
          this.utilitiesService.formSuccessCreateMessage(this.snackBar);
          this.searchData();
        }
      }
    );
  }

  edit(usuario: ActividadModel): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dataParam = {
      itemData: usuario
    };
    dialogConfig.data = dataParam;

    const dialogRef = this.dialog.open(ActividadEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (val: any) => {
        if (val) {
          this.utilitiesService.formSuccessUpdateMessage(this.snackBar);
          this.searchData();
        }
      }
    );
  }

}

