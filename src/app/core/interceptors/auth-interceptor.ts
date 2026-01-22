import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Telegram } from '../services';
import { from, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const telegram = inject(Telegram);

  if (req.url.includes('accounts/auth/telegram')) {
    return next(req);
  }
  return from(telegram.getCloudStorage('access_token')).pipe(
    switchMap((token) => {
      const newReq = token
        ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) })
        : req;
      return next(newReq);
    }),
  );
};
