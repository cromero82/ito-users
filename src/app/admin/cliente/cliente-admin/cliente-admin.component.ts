
import { Component, OnInit, AfterViewInit, ViewChild, Pipe, PipeTransform } from '@angular/core';
import { ClienteCriteria } from '../model/cliente-criteria';
import { ClienteModel } from '../model/cliente-model';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatDialogConfig } from '@angular/material';
import { CLIENTE_CONSTANTS } from '../model/CLIENTE_CONSTANTS';
import { UtilitiesService } from 'app/admin/shared/services/utilities.service';
import { TempDataService } from 'app/admin/shared/services/temp-data.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { ClienteEditComponent } from '../cliente-edit/cliente-edit.component';
import { ClienteService } from '../service/cliente.service';
import { ClienteDatasource } from '../model/cliente-datasource';

@Component({
  selector: 'app-cliente-admin',
  templateUrl: './cliente-admin.component.html',
  styleUrls: ['./cliente-admin.component.css']
})
export class ClienteAdminComponent implements OnInit, AfterViewInit {
  titulo = 'Gestión de clientes';
  MyDataSource: any;
  clienteCriteria: ClienteCriteria = new ClienteCriteria();
  Cliente: ClienteModel = new ClienteModel();
  displayedColumns = [
    'sharedKey',
    'nombre',
      'telefono',
      'correo',
      'fechaCreacion',
      'actions'
  ];
  busquedaAvanzada = false;
  disableSubmit = false;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort = new MatSort;

  clienteDatasource: ClienteDatasource<ClienteModel>;
  loading = true;
  constants = CLIENTE_CONSTANTS;
  disabledButton = false;

  constructor(
    private clienteService: ClienteService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private utilitiesService: UtilitiesService,
    private tempDataService: TempDataService,
    private router: Router
    ) {}

  ngOnInit() {
      const grupoSerializado =  this.tempDataService.getDataNivel1();
      this.clienteDatasource = new ClienteDatasource(this.clienteService);
  }

  ngAfterViewInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
      this.clienteDatasource.loadingSubject$.subscribe( (_loading: boolean) => {
          this.loading = _loading;
      });

      this.paginator.page.pipe(tap(() => this.searchData())).subscribe();
      this.sort.sortChange.subscribe((dir: any) => {
          this.searchData();
      });
      this.clienteDatasource.errorSubject$.subscribe( (resultError: any) => {
        if ( resultError.ok !== undefined && resultError.ok === false) {
          this.utilitiesService.actionErrorMessages(resultError, this.snackBar);
        }
      });
      this.searchData();
  }

  onFilter(): void{
    this.searchData();
  }

  onTypeSearch(): void {
    this.busquedaAvanzada = !this.busquedaAvanzada;
  }

  searchData(): void {
      this.clienteCriteria.setTableElements(this.paginator, this.sort);
      this.clienteDatasource.sort = this.sort;
      this.clienteDatasource.paginator = this.paginator;
      this.clienteDatasource.search(this.clienteCriteria);
  }

  create(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const newCliente = new ClienteModel();
    const dataParam = {
      itemData: newCliente
    };
    dialogConfig.data = dataParam;

    const dialogRef = this.dialog.open(ClienteEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (val: any) => {
        if (val) {
          this.utilitiesService.formSuccessCreateMessage(this.snackBar);
          this.searchData();
        }
      }
    );
  }

  edit(cliente: ClienteModel): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dataParam = {
      itemData: cliente
    };
    dialogConfig.data = dataParam;

    const dialogRef = this.dialog.open(ClienteEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (val: any) => {
        if (val) {
          this.utilitiesService.formSuccessUpdateMessage(this.snackBar);
          this.searchData();
        }
      }
    );
  }

  grupoNivelTemas(grupoNivel: ClienteModel): void {
    this.tempDataService.setDataNivel2( JSON.stringify(grupoNivel));
    this.router.navigate(['/grupo-nivel-tema']);
  }

}
