export class UsuarioModel {
  id!: number;
  nombre!: string;
  apellido!: string;
  nombreusuario!: string;
  correo!: string;
  activo!: string;
  constructor() {
    this.nombre = '';
    this.activo = '';
  }
}
