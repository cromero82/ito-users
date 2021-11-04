export class ClienteModel {
    id: number;
  nombre: string;
  fechaCreacion: Date;
  sharedKey!: string;
  telefono!: string;
  correo!: string;
  constructor() {
    this.id = 0;
    this.nombre = '';
  }
}
