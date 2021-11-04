
import { Component, OnInit, Inject } from '@angular/core';
import { ClienteModel } from '../model/cliente-model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatDialogRef, MatSnackBar, MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { UserService } from 'app/seguridad/services/user.service';
import { UtilitiesService } from 'app/admin/shared/services/utilities.service';
import { GeneralConfirmComponent } from 'app/admin/shared/components/general-confirm/general-confirm.component';
import { CLIENTE_CONSTANTS } from '../model/CLIENTE_CONSTANTS';
import { ClienteService } from '../service/cliente.service';

import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// import {default as _rollupMoment} from 'moment';
// const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/yyyy',
  },
  display: {
    dateInput: 'DD/MM/yyyy',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-cliente-edit',
  templateUrl: './cliente-edit.component.html',
  styleUrls: ['./cliente-edit.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class ClienteEditComponent implements OnInit{
  roles: any = [];
  cliente: ClienteModel;
  form: FormGroup;
  submitted = false;
  disableSubmit = false;
  constants = CLIENTE_CONSTANTS;
  filteredEstudiantes: Observable<ClienteModel>;
  estudianteList: ClienteModel[] = [];
  clone = {};
  constructor(private dialogRef: MatDialogRef<ClienteEditComponent>,
    private formBuilder: FormBuilder,
    private servicio: ClienteService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService,
    @Inject(MAT_DIALOG_DATA) data: any) {
      this.cliente = data.itemData;
    }

  ngOnInit(): void {
    this.initForm();
    if (this.cliente.id > 0) {
      this.clone = JSON.parse(JSON.stringify(this.cliente));
    }else {
      this.cliente.id = 0;
    }
  }

  initForm() {
    if(this.cliente === undefined || this.cliente === null) {
      this.cliente = new ClienteModel();
    }
   this.form = this.formBuilder.group({
    'id': [null, null],
    'sharedKey': [null, [Validators.required, Validators.maxLength(100),]],
    'fechaCreacion': [Validators.required],
    'nombre': [null, [Validators.required, Validators.maxLength(100),]],
    'telefono': [null, [Validators.required, Validators.maxLength(15),]],
    'correo': [null, [
      Validators.required,
      Validators.maxLength(100),
      Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')
    ]]
   });
  //  this.form.get('activo')!.setValue(this.cliente.activo);
  //  this.form.get('avatar')!.setValue(this.cliente.avatar);

  }


  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onChangeArchivo(archivoId: number) {
    if (archivoId > 0 ) {
      const datagenia =  { id : archivoId  };
      let form = this.form.get('datagenia') as any;
      form.setValue(datagenia);
    }
  }

  onSubmit() {
    this.submitted = true;
    // if (this.cliente.password !== this.cliente.repetirPassword) {
    //   this.utilitiesService.simpleWarningMessage('La contraseña es distinta en cada campo', this.snackBar);
    //   return;
    // }
    // this.cliente.username = this.cliente.email;
    //this.form.get('activo')!.setValue(this.cliente.activo);

    this.markFormGroupTouched(this.form);
    // se actualizan las listas con el model
    this.cliente = this.form.value;
    // if (this.form.value.listatipopregunta !== undefined) {
    //   this.form.get('tipopregunta')!.setValue(this.form.value.listatipopregunta.id);
    // }
    if (this.form.valid === true) {
      // this.enviada = true;
      // this.disabledBtn_Login = true;
      this.save();
    } else {
      this.utilitiesService.formWarningMessage(this.snackBar);
    }
  }

  save() {
    if(this.form.value.id == 0) {
      this.servicio.create(this.form.value).subscribe(
        data => {
          this.dialogRef.close(this.form.value);
        },
        error => {
          this.onErrorResult(error);
        }
      );
    } else {
      this.servicio.update(this.form.value).subscribe(
        data => {
          this.dialogRef.close(this.form.value);
        },
        error => {
          this.onErrorResult(error);
        }
      );
    }
  }

  onErrorResult(error:any) {
    this.disableSubmit = false;
    this.utilitiesService.formErrorMessages(error, this.form, this.snackBar);
  }

  close() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(GeneralConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe((val: any) => {
      if (val === 1) {
        Object.assign(this.cliente, this.clone);
        this.dialogRef.close();
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control: FormGroup) => {
      control.markAsTouched();
      control.updateValueAndValidity();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  displayFnUser(user: ClienteModel) {
    if (user) { return user.nombre; }
  }

}


