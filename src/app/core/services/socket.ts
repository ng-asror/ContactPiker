import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Telegram } from './telegram';

interface WSMessage<T = any> {
	type: string;
	data: T;
}
interface WSIncomingMessage<T = any> {
	type: string;
	message: T;
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
				const data: WSIncomingMessage = JSON.parse(event.data);
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

	/** Event tinglash (Socket.IO on analogi) */
	listen<T>(type: string): Observable<T> {
		return new Observable<T>((observer) => {
			if (!this.ws) {
				console.warn(`WS ulanmagan: "${type}" ni tinglab bo‘lmaydi.`);
				return;
			}

			const handler = (e: MessageEvent) => {
				try {
					const msg: WSIncomingMessage<T> = JSON.parse(e.data);

					if (msg.type === type) {
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
