import { Component, OnInit, AfterViewInit, ViewChild, Pipe, PipeTransform } from '@angular/core';
import { UsuarioCriteria } from '../model/usuario-criteria';
import { UsuarioModel } from 'app/seguridad/models/usuario-model';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatDialogConfig } from '@angular/material';
import { CONSTANTS_SHARED } from 'app/admin/shared/constants-shared';
import { UtilitiesService } from 'app/admin/shared/services/utilities.service';
import { TempDataService } from 'app/admin/shared/services/temp-data.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { UsuarioEditComponent } from '../usuario-edit/usuario-edit.component';
import { UserService } from 'app/seguridad/services/user.service';
import { UsuarioDatasource } from '../service/usuario-datasource';
import { ArrayListPipe } from 'app/admin/pipe/array-list.pipe';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-usuario-admin',
  templateUrl: './usuario-admin.component.html',
  styleUrls: ['./usuario-admin.component.css'],
  providers: [ ArrayListPipe ]
})
export class UsuarioAdminComponent implements OnInit, AfterViewInit {
  titulo = 'Gestión de usuarios';
  MyDataSource: any;
  UsuarioCriteria: UsuarioCriteria = new UsuarioCriteria();
  Usuario: UsuarioModel = new UsuarioModel();
  displayedColumns = [
      'nombreusuario',
      'correo',
      'nombre',
      'apellido',
      'activo',
      'actions'
  ];
  
  filterForm: FormGroup;

  @ViewChild(MatPaginator, { static: false })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false })
  sort: MatSort = new MatSort;

  usuarioDatasource: UsuarioDatasource<UsuarioModel>;
  loading = true;
  constants = CONSTANTS_SHARED;
  disabledButton = false;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private utilitiesService: UtilitiesService,
    private tempDataService: TempDataService,
    private router: Router,
    private formBuilder: FormBuilder
    ) {}

  ngOnInit() {
      const grupoSerializado =  this.tempDataService.getDataNivel1();
      this.usuarioDatasource = new UsuarioDatasource(this.userService);
      this.initForm();
  }

  initForm() {
   this.filterForm = this.formBuilder.group({
    'nombreusuario': [null, null],
    'nombre': [null, null],
    'apellido': [null, null],
    'correo': [null, null]
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
      this.UsuarioCriteria.setTableElements(this.paginator, this.sort);
      this.usuarioDatasource.sort = this.sort;
      this.usuarioDatasource.paginator = this.paginator;
      
      this.asignarFiltrosACriterios();

      this.usuarioDatasource.search(this.UsuarioCriteria);
  }

  asignarFiltrosACriterios(): void {
    if(this.filterForm.get('nombreusuario')?.value != null){
      this.UsuarioCriteria.nombreusuario = this.filterForm.get('nombreusuario')?.value;
    }
    if(this.filterForm.get('correo')?.value != null){
      this.UsuarioCriteria.correo = this.filterForm.get('correo')?.value;
    }
    if(this.filterForm.get('nombre')?.value != null){
      this.UsuarioCriteria.nombre = this.filterForm.get('nombre')?.value;
    }
    if(this.filterForm.get('apellido')?.value != null){
      this.UsuarioCriteria.apellido = this.filterForm.get('apellido')?.value;
    }
  }

  create(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const newUsuario = new UsuarioModel();
    const dataParam = {
      itemData: newUsuario
    };
    dialogConfig.data = dataParam;

    const dialogRef = this.dialog.open(UsuarioEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (val: any) => {
        if (val) {
          this.utilitiesService.formSuccessCreateMessage(this.snackBar);
          this.searchData();
        }
      }
    );
  }

  edit(usuario: UsuarioModel): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dataParam = {
      itemData: usuario
    };
    dialogConfig.data = dataParam;

    const dialogRef = this.dialog.open(UsuarioEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (val: any) => {
        if (val) {
          this.utilitiesService.formSuccessUpdateMessage(this.snackBar);
          this.searchData();
        }
      }
    );
  }

  grupoNivelTemas(grupoNivel: UsuarioModel): void {
    this.tempDataService.setDataNivel2( JSON.stringify(grupoNivel));
    this.router.navigate(['/grupo-nivel-tema']);
  }

}
