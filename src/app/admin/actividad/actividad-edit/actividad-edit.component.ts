import { UsuarioModel } from './../../../seguridad/models/usuario-model';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { GeneralConfirmComponent } from 'app/admin/shared/components/general-confirm/general-confirm.component';
import { CONSTANTS_SHARED } from 'app/admin/shared/constants-shared';
import { UtilitiesService } from 'app/admin/shared/services/utilities.service';
import { UserService } from 'app/seguridad/services/user.service';
import { Observable } from 'rxjs';
import { ActividadModel } from '../model/actividad-model';
import { ActividadService } from '../service/actividad.service';

@Component({
  selector: 'app-actividad-edit',
  templateUrl: './actividad-edit.component.html',
  styleUrls: ['./actividad-edit.component.css']
})
export class ActividadEditComponent implements OnInit{
  roles: any = [];
  listaRoles: any = ['ADMINISTRADOR', 'TUTOR', 'ESTUDIANTE'];
  actividad: ActividadModel;
  form: FormGroup;
  submitted = false;
  disableSubmit = false;
  constants = CONSTANTS_SHARED;
  filteredEstudiantes: Observable<ActividadModel>;
  empleadoList: UsuarioModel[] = [];
  empleado: UsuarioModel;
  clone = {};
  constructor(private dialogRef: MatDialogRef<ActividadEditComponent>,
    private formBuilder: FormBuilder,
    private servicio: ActividadService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService,
    private empleadosService: UserService,
    @Inject(MAT_DIALOG_DATA) data: any) {
      this.actividad = data.itemData;
    }

  ngOnInit(): void {
    this.initForm();
    if (this.actividad.id > 0) {
      this.clone = JSON.parse(JSON.stringify(this.actividad));
    }else {
      this.actividad.id = 0;
    }
  }

  initForm() {
    if(this.actividad === undefined || this.actividad === null) {
      this.actividad = new ActividadModel();
    }
   this.form = this.formBuilder.group({
    'id': [null, null],
    'nombre': [null, [Validators.required]],
    'empleadoAsignado': [null, [Validators.required]],
    'fechaPlaneadaFinalizacion': [null, [Validators.required]],
    'fechaFinalizacion': [null, null],
    'diasRetraso': [null, null],
    'statusDescr': [null, null]
    });
    this.cargarEmpleados();
  }

  cargarEmpleados() {
    this.empleadosService.findAll().subscribe( (grupos: any[]) => {
      this.empleadoList = grupos;
      if(this.empleado.id > 0) {
        const toSelect = grupos.find(c => c.id === this.empleado.id);
        this.form.get('empleado')!.setValue(toSelect);
      }
    }, err => {
     alert('Error consultando lista de empleados');
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;

    this.markFormGroupTouched(this.form);
    // se actualizan las listas con el model
    this.actividad = this.form.value;
    if (this.form.valid === true) {
      this.save();
    } else {
      this.utilitiesService.formWarningMessage(this.snackBar);
    }
  }

  save() {
    if (this.actividad.id === 0) {
      this.servicio.register(this.form.value).subscribe(
        data => {
          this.dialogRef.close(this.form.value);
        },
        error => {
          this.disableSubmit = false;
          this.utilitiesService.formErrorMessages(error, this.form, this.snackBar);
        }
      );
    }else{
      this.servicio.update(this.form.value).subscribe(
        data => {
          this.dialogRef.close(this.form.value);
        },
        error => {
          this.disableSubmit = false;
          this.utilitiesService.formErrorMessages(error, this.form, this.snackBar);
        }
      );
    }
    
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
        Object.assign(this.actividad, this.clone);
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

  displayFnUser(user: ActividadModel) {
    if (user) { return user.nombre; }
  }

}
