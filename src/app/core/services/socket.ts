import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Telegram } from './telegram';

interface WSMessage<T = any> {
  event: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class Socket {
  private telegram = inject(Telegram);
  private ws: WebSocket | null = null;

  /** Socket ulanishini boshlash */
  initSocket(token: string | null, url: string) {
    this.ws = new WebSocket(`wss://app.youcarrf.ru/ws/${url}/?token=${token}`);

    this.ws.onopen = () => {
      console.log('✅ WS: connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const data: WSMessage = JSON.parse(event.data);
        console.log('📩 WS message:', data);
      } catch (err) {
        console.error('WS parse error', err);
      }
    };

    this.ws.onerror = (err) => {
      console.error('❌ WS error', err);
      this.telegram.showAlert('❌ Сигнал: ошибка подключения');
    };

    this.ws.onclose = () => {
      console.warn('⚠️ WS closed');
      this.telegram.showAlert('⚠️ Сигнал: соединение потеряно');
    };
  }

  /** Event yuborish (Socket.IO emit analogi) */
  emit<T>(event: string, data: T): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn(`WS ulanmagan: emit "${event}" ishlamadi.`);
      return;
    }

    const message: WSMessage<T> = { event, data };
    this.ws.send(JSON.stringify(message));
  }

  /** Event tinglash (Socket.IO on analogi) */
  listen<T>(event: string): Observable<T> {
    return new Observable<T>((observer) => {
      if (!this.ws) {
        console.warn(`WS ulanmagan: "${event}" ni tinglab bo‘lmaydi.`);
        return;
      }

      const handler = (e: MessageEvent) => {
        try {
          const msg: WSMessage<T> = JSON.parse(e.data);
          if (msg.event === event) {
            observer.next(msg.data);
          }
        } catch (err) {
          console.error('WS parse error:', err);
        }
      };

      this.ws.addEventListener('message', handler);

      // unsubscribe bo‘lganda listener o‘chadi
      return () => {
        this.ws?.removeEventListener('message', handler);
      };
    });
  }

  /** Socket holatini olish */
  getSocket(): WebSocket | null {
    return this.ws;
  }

  /** Ulanishni uzish */
  disconnect(): void {
    this.ws?.close();
    this.ws = null;
  }
}
