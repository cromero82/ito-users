import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DemoMaterialModule } from 'app/demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GeneralConfirmComponent } from './shared/components/general-confirm/general-confirm.component';
import { MatSelectFilterModule } from 'mat-select-filter';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { UsuarioAdminComponent } from './usuario/usuario-admin/usuario-admin.component';
import { UsuarioEditComponent } from './usuario/usuario-edit/usuario-edit.component';
import { ArrayListPipe } from './pipe/array-list.pipe';
import { ChartistModule } from 'ng-chartist';

export const AdminRoutes: Routes = [
  {
    path: 'usuarios',
      component: UsuarioAdminComponent
  }
];

@NgModule({
  declarations: [
    GeneralConfirmComponent,
    UsuarioAdminComponent, UsuarioEditComponent, ArrayListPipe
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
