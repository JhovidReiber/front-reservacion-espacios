import { HttpInterceptorFn } from '@angular/common/http';

export const JWTInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('authJwt');

  if (req.url.includes('/check-username')) {
      return next(req); // No agrega el JWT en este caso
    }
  const newReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });


  return next(newReq);
};
