import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Account, Socket, Telegram } from '../services';
import { catchError, firstValueFrom, from, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const telegram = inject(Telegram);
  const account = inject(Account);
  const socketService = inject(Socket);
  const initData = telegram.tg.initData;
  if (req.url.includes('accounts/auth/telegram')) {
    return next(req);
  }
  return from(telegram.getCloudStorage('access_token')).pipe(
    switchMap((token) => {
      const newReq = token
        ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) })
        : req;
      return next(newReq).pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.status === 401) {
            firstValueFrom(account.login({ initData })).then(() => {
              socketService.initSocket(token, 'notifications')
            });
          }
          return throwError({});
        }),
      );
    }),
  );
};
