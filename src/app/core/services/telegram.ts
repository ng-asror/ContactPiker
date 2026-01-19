import { Injectable } from '@angular/core';
import { ITgUser } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class Telegram {
  tg = (window as any).Telegram.WebApp;

  // get User
  async getTgUser(): Promise<ITgUser> {
    return await this.tg.initDataUnsafe;
  }

  // Get User contacts
  async getUserContacts(): Promise<any> {
    await this.tg.requestContact((contacts: any) => {
      return contacts;
    });
  }
}
