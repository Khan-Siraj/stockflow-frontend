import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const clone = req.clone;
  const token = localStorage.getItem('token');
  req = clone({
    url: environment.apiUrl + req.url,
    setHeaders: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
  return next(req);
};
