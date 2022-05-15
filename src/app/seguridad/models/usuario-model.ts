export class UsuarioModel {
  id!: number;
  nombre!: string;
  correo!: string;
  activo!: string;
  constructor() {
    this.nombre = '';
    this.activo = '';
  }
}
