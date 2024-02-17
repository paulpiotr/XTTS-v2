import { Injectable } from '@angular/core';

@Injectable()
export class AppInfoService {
  constructor() {}

  public get title() {
    return 'XTTS V2 Devextreme Angular App';
  }

  public get currentYear() {
    return new Date().getFullYear();
  }
}
