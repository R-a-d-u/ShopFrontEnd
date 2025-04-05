import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../app/components/home/home.component'; 
import { JewelryComponent } from '../app/components/jewelry/jewelry.component'; 
import { AdminComponent } from '../app/components/admin/admin.component';
import { CartComponent } from '../app/components/cart/cart.component';
import { CreateAccountComponent } from '../app/components/create-account/create-account.component';
import { GoldBarsComponent } from '../app/components/gold-bars/gold-bars.component';
import { GoldCoinsComponent } from '../app/components/gold-coins/gold-coins.component';
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

const routes: Routes = [
  { path: '', component: HomeComponent }, 
  { path: 'jewelry', component: JewelryComponent },
  { path: 'cart', component: CartComponent },
  { path: 'create-account', component: CreateAccountComponent },
  { path: 'gold-bars', component: GoldBarsComponent },
  { path: 'gold-coins', component: GoldCoinsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'product-details/:id', component: ProductDetailsComponent },
  { path: 'my-orders', component: MyOrdersComponent },
  { path: 'order/:id', component: OrderComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'profile/edit-info', component : EditUserInfoComponent},
  { path: 'profile/edit-password', component : EditUserPasswordComponent},
  { path: 'admin', component: AdminComponent },
  { path: 'admin/statistics', component: StatisticsComponent },
  { path: 'admin/category', component: CategoryListComponent },
  { path: 'admin/category/details/:id', component: CategoryDetailsComponent },
  { path: 'admin/category/add', component: CategoryAddComponent },
  { path: 'admin/category/edit/:id', component: CategoryEditComponent },
  { path: 'admin/product', component: ProductListComponent },
  { path: 'admin/product/add', component: ProductAddComponent },
  { path: 'admin/product/edit-price/:id', component: ProductEditPriceComponent },
  { path: 'admin/product/edit-info/:id', component: ProductEditInfoComponent },
  { path: 'admin/inventory', component: ProductStockListComponent},
  { path: 'admin/inventory/edit-stock/:id', component: ProductEditStockComponent},
  { path: 'admin/user', component: UserListComponent},
  { 
    path: 'cart', 
    component: CartComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'admin', 
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  { 
    path: 'profile', 
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'orders/:id', 
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
