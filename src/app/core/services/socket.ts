import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Telegram } from './telegram';
import { IMessage, IMessagesRes } from '../../features/notification/interfaces';
import { INotification } from '../interfaces';

/** WSga yuboriladigan xabar */
interface WSMessage<T = any> {
  type: string;
  data: T;
}

/** WSdan keladigan xabar bazasi */
interface WSIncomingMessageBase {
  type: string;
}

/** Generic xabar tipi: K = key nomi, T = qiymat tipi */
type WSIncomingMessage<K extends string, T> = WSIncomingMessageBase & {
  [key in K]: T;
};

@Injectable({
  providedIn: 'root',
})
export class Socket {
  private telegram = inject(Telegram);
  private ws: WebSocket | null = null;
  chatIdSubject = new BehaviorSubject<number | null>(null);
  chatId$ = this.chatIdSubject.asObservable();
  
  /** Socket ulanishini boshlash */
  initSocket(token: string | null, url: string) {
    this.ws = new WebSocket(`wss://app.youcarrf.ru/ws/${url}/?token=${token}`);
    this.ws.onopen = () => {
      console.log('✅ WS: connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const data: any = JSON.parse(event.data);
        console.log('📩 WS message:', data);
      } catch (err) {
        console.error('WS parse error', err);
      }
    };

    this.ws.onerror = (err) => {
      console.error('❌ WS error', err);
      console.error('❌ Сигнал: ошибка подключения');
    };

    this.ws.onclose = () => {
      console.warn('⚠️ WS closed');
      console.warn('⚠️ Сигнал: соединение потеряно');
    };
  }

  /** Event yuborish (Socket.IO emit analogi) */
  emit<T>(event: string, data: T): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    this.ws.send(
      JSON.stringify({
        message: data,
      }),
    );
  }

  /** Message xabarlarini tinglash */
  listenMessage(): Observable<IMessage> {
    return new Observable<IMessage>((observer) => {
      if (!this.ws) {
        console.warn(`WS ulanmagan: "message" ni tinglab bo‘lmaydi.`);
        return;
      }

      const handler = (e: MessageEvent) => {
        try {
          const msg: WSIncomingMessage<'message', IMessage> = JSON.parse(e.data);
          if (msg.type === 'chat_message') {
            observer.next(msg.message);
          }
        } catch (err) {
          console.error('WS parse error:', err);
        }
      };

      this.ws.addEventListener('message', handler);

      return () => {
        this.ws?.removeEventListener('message', handler);
      };
    });
  }

  /** Notification xabarlarini tinglash */
  listenNotification(): Observable<INotification> {
    return new Observable<INotification>((observer) => {
      if (!this.ws) {
        console.warn(`WS ulanmagan: "notification" ni tinglab bo‘lmaydi.`);
        return;
      }

      const handler = (e: MessageEvent) => {
        try {
          const msg: WSIncomingMessage<'notification', INotification> = JSON.parse(e.data);
          console.log(msg.type);

          if (msg.type === 'notification') {
            observer.next(msg.notification);
          }
        } catch (err) {
          console.error('WS parse error:', err);
        }
      };

      this.ws.addEventListener('message', handler);

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
