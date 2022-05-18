import { Empleado } from "./empleado";

export class ActividadModel {
    id!: number;
  nombre!: string;
  status!: number;
  empleadoAsignado!: Empleado;
  fechaCreacion!: Date;
  fechaPlaneadaFinalizacion!: Date;
  fechaFinalizacion!: Date;
  diasRetraso!: number;
  constructor() {
    this.nombre = '';
    this.status = 0;
    this.empleadoAsignado = new Empleado();
    this.diasRetraso = 0;
  }
}
