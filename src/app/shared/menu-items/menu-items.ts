import { Injectable } from '@angular/core';
import { TokenStorageService } from 'app/seguridad/services/token-storage.service';

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  permission: string;
}

const MENUITEMS = [
  { state: 'clientes', name: 'Gestión clientes', type: 'link', icon: 'supervisor_account'},
];

@Injectable()
export class MenuItems {
  constructor(private tokenStorage: TokenStorageService) {
  }
  getMenuitem(){
    const roles = this.tokenStorage.getRolesUsuario() as string[];
    let itemsMenuConfirmados: ({ state: string; name: string; type: string; icon: string; permission: string; } | { state: string; name: string; type: string; icon: string; permission?: undefined; })[] = [];
    
      MENUITEMS.forEach(element => {
          itemsMenuConfirmados.push(element);
      });
    return itemsMenuConfirmados;
  }
}
