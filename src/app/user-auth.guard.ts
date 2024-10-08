import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserService } from './services/user.service';
import { map } from 'rxjs/operators';

export const userAuthGuard: CanActivateFn = (route, state) => {
  const userService=inject(UserService);
  return userService.isUserLoggedIn.pipe(
    map(isLoggedIn => isLoggedIn)
  );
};
