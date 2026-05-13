import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const isAbsoluteUrl = req.url.startsWith('http://') || req.url.startsWith('https://');
  const isAsset = req.url.startsWith('assets/');
  const targetUrl = isAbsoluteUrl || isAsset ? req.url : `${environment.apiUrl}${req.url}`;
  const clonedRequest = req.clone({
    url: targetUrl,
    setHeaders: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return next(clonedRequest);
};
