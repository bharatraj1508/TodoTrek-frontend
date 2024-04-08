import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('user-token');
  const router = inject(Router);
  if (token) {
    return true;
  } else {
    window.alert('Access not allowed!');
    router.navigate(['login']);
    return false;
  }
};
