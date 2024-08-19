import { inject } from '@angular/core';
import { SellerService } from './services/seller.service';
import { CanActivateFn } from '@angular/router';
import { map } from 'rxjs/operators';

export const sellerAuthGuard: CanActivateFn = (route, state) => {
  const sellerService = inject(SellerService);
  return sellerService.isSellerLoggedIn.pipe(
    map(isLoggedIn => isLoggedIn)
  );
};
