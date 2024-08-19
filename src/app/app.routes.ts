import { SellerAddProductComponent } from './seller-add-product/seller-add-product.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SellerAuthComponent } from './seller-auth/seller-auth.component';
import { CartComponent } from './cart/cart.component';
import { SellerHomePageComponent } from './seller-home-page/seller-home-page.component';
import { sellerAuthGuard } from './seller-auth.guard';
import { SellerUpdateProductComponent } from './seller-update-product/seller-update-product.component';
import { SearchComponent } from './search/search.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { UserAuthComponent } from './user-auth/user-auth.component';

export const routes: Routes = [

  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'seller-auth',
    component: SellerAuthComponent,
  },
  {
    path: 'cart',
    component: CartComponent,
  },
  {
    path: 'product-detail/:id',
    component: ProductDetailComponent,
  },
  {
    path: 'seller-home',
    component: SellerHomePageComponent,
    canActivate: [sellerAuthGuard],
  },
  {
    path: 'seller-add-product',
    component: SellerAddProductComponent,
    canActivate: [sellerAuthGuard],
  },
  {
    path: 'seller-update-product/:id',
    component: SellerUpdateProductComponent,
    canActivate: [sellerAuthGuard],
  },
  {
    path: 'search/:query',
    component: SearchComponent,
  },
  {
    path: 'user-auth',
    component: UserAuthComponent,
  }
];

