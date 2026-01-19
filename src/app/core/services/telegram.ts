import { inject, Injectable } from '@angular/core';
import { ITgUser } from '../interfaces';
import { Router } from '@angular/router';

interface TgButton {
  show(): void;
  hide(): void;
  onClick(fn: Function): void;
  offClick(fn: Function): void;
}

@Injectable({
  providedIn: 'root',
})
export class Telegram {
  tg = (window as any).Telegram.WebApp;
  private router = inject(Router);

  async getTgUser(): Promise<ITgUser> {
    return await this.tg.initDataUnsafe;
  }
  async getUserLocalId(): Promise<string> {
    const id = await this.getCloudStorage('tg_id');
    return id;
  }

  init(headerColor: string): void {
    this.tg.ready();
    this.tg.setHeaderColor(headerColor);
    this.tg.expand();
    this.tg.enableClosingConfirmation();
  }

  get BackButton(): TgButton {
    return this.tg.BackButton;
  }

  hapticFeedback(type: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void {
    this.tg.HapticFeedback.impactOccurred(type);
  }

  // This method sets a custom keyboard for Telegram Web App.
  async setCloudItem(key: string, value: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.tg.CloudStorage.setItem(key, value, (error: any, success: boolean) => {
        if (error) {
          reject(error);
        } else if (success) {
          resolve();
        }
      });
    });
  }

  // This method retrieves an item from Telegram's cloud storage.
  async getCloudStorage(key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.tg.CloudStorage.getItem(key, (error: any, value: string) => {
        if (error) {
          reject(error);
        } else {
          resolve(value);
        }
      });
    });
  }

  // This method removes an item from Telegram's cloud storage.
  async removeCloudItem(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.tg.CloudStorage.removeItem(key, (error: any, success: boolean) => {
        if (error) {
          reject(error);
        } else if (success) {
          resolve();
        }
      });
    });
  }
  showAlert(message: string): void {
    this.tg.showAlert(message);
  }

  showPopup(title: string, message: string) {
    if (!this.tg) return;
    this.tg.showPopup({
      title: title,
      message: message,
      buttons: [{ id: 'ok', type: 'close', text: 'OK' }],
    });
  }
  showToast(txt: string): void {
    this.tg.showToast(txt);
  }

  // back button events
  showBackButton(url: string): void {
    if (!this.BackButton) {
      return;
    }
    this.BackButton.show();
    this.BackButton.onClick(() => this.router.navigate([url]));
  }
  hiddeBackButton(url: string): void {
    if (!this.BackButton) {
      return;
    }

    this.BackButton.hide();
    this.BackButton.offClick(() => this.router.navigate([url]));
  }

  open(telegramLink: string): void {
    if (this.tg) {
      this.tg.openTelegramLink(telegramLink);
    }
  }

  shareData(shareTxt: string): void {
    this.tg.shareData({ text: shareTxt });
  }
}
