import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DemoMaterialModule } from 'app/demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GeneralConfirmComponent } from './shared/components/general-confirm/general-confirm.component';
import { TemaListComponent } from './tema/tema-list/tema-list.component';
import { TemaEditComponent } from './tema/tema-edit/tema-edit.component';
import { MatSelectFilterModule } from 'mat-select-filter';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { HassPermissionDirective } from 'app/administracion/directivas/hass-permission.directive';
import { UsuarioAdminComponent } from './usuario/usuario-admin/usuario-admin.component';
import { UsuarioEditComponent } from './usuario/usuario-edit/usuario-edit.component';
import { ArrayListPipe } from './pipe/array-list.pipe';
import { ChartistModule } from 'ng-chartist';
import { ClienteAdminComponent } from './cliente/cliente-admin/cliente-admin.component';
import { ClienteEditComponent } from './cliente/cliente-edit/cliente-edit.component';

export const AdminRoutes: Routes = [
  {
    path: 'clientes',
      component: ClienteAdminComponent
  }
];

@NgModule({
  declarations: [
    GeneralConfirmComponent,
    TemaListComponent, TemaEditComponent,
    HassPermissionDirective, UsuarioAdminComponent, UsuarioEditComponent, ArrayListPipe, ClienteAdminComponent, ClienteEditComponent
  ],
  imports: [
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectFilterModule,
    NgxMatSelectSearchModule,
    ChartistModule,
    RouterModule.forChild(AdminRoutes)
  ]
})
export class AdminModule { }
