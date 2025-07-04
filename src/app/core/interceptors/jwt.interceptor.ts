import { HttpInterceptorFn } from '@angular/common/http';

export const JWTInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('authJwt');
  // console.log('token jwt interceptor:', token);

  const newReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });


  return next(newReq);
};
