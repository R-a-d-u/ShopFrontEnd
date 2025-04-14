import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../app/components/home/home.component';
import { AdminComponent } from '../app/components/admin/admin.component';
import { CartComponent } from '../app/components/cart/cart.component';
import { CreateAccountComponent } from '../app/components/create-account/create-account.component';
import { LoginComponent } from '../app/components/login/login.component';
import { ProductDetailsComponent } from '../app/components/product-details/product-details.component';
import { AuthGuard } from './guards/auth.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
import { OrderComponent } from './components/order/order.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { EditUserInfoComponent } from './components/edit-user-info/edit-user-info.component';
import { EditUserPasswordComponent } from './components/edit-user-password/edit-user-password.component';
import { StatisticsComponent } from './components/admin/statistics/statistics.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { CategoryDetailsComponent } from './components/category-details/category-details.component';
import { CategoryAddComponent } from './components/category-add/category-add.component';
import { CategoryEditComponent } from './components/category-edit/category-edit.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductStockListComponent } from './components/product-stock-list/product-stock-list.component';
import { ProductAddComponent } from './components/product-add/product-add.component';
import { ProductEditStockComponent } from './components/product-edit-stock/product-edit-stock.component';
import { ProductEditPriceComponent } from './components/product-edit-price/product-edit-price.component';
import { ProductEditInfoComponent } from './components/product-edit-info/product-edit-info.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserViewAnalyticsComponent } from './components/user-view-analytics/user-view-analytics.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { CustomerOrderListComponent } from './components/customer-order-list/customer-order-list.component';
import { ProductShopListComponent } from './components/product-shop-list/product-shop-list.component';
import { GoldHistoryComponent } from './components/gold-history/gold-history.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'create-account',
    component: CreateAccountComponent
  },
  {
    path: 'category/:id',
    component: ProductShopListComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'product-details/:id',
    component: ProductDetailsComponent
  },
  {
    path: 'my-orders',
    component: MyOrdersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile/edit-info',
    component: EditUserInfoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile/edit-password',
    component: EditUserPasswordComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'employee'] }
  },
  {
    path: 'admin/statistics',
    component: StatisticsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'admin/category',
    component: CategoryListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'admin/category/details/:id',
    component: CategoryDetailsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'admin/category/add',
    component: CategoryAddComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'admin/category/edit/:id',
    component: CategoryEditComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'admin/product',
    component: ProductListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'admin/product/add',
    component: ProductAddComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'admin/product/edit-price/:id',
    component: ProductEditPriceComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'admin/product/edit-info/:id',
    component: ProductEditInfoComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'admin/product/product-details/:id',
    component: ProductDetailsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'admin/inventory',
    component: ProductStockListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'employee'] }
  },
  {
    path: 'admin/inventory/edit-stock/:id',
    component: ProductEditStockComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'employee'] }
  },
  {
    path: 'admin/inventory/product-details/:id',
    component: ProductDetailsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'employee'] }
  },
  {
    path: 'admin/user',
    component: UserListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'admin/user/details/:id',
    component: UserViewAnalyticsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'admin/order',
    component: OrderListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'employee'] }
  },
  {
    path: 'admin/order/details/:id',
    component: OrderComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'employee'] }
  },
  {
    path: 'admin/customer',
    component: CustomerListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'employee'] }
  },
  {
    path: 'admin/customer/details/:id',
    component: UserViewAnalyticsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'employee'] }
  },
  {
    path: 'admin/customer/order-list/:id',
    component: CustomerOrderListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'employee'] }
  },
  {
    path: 'admin/customer/order/:id',
    component: OrderComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'employee'] }
  },
  {
    path: 'admin/gold-history',
    component: GoldHistoryComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'order/:id',
    component: OrderComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
