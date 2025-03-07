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

const routes: Routes = [
  { path: '', component: HomeComponent }, 
  { path: 'jewelry', component: JewelryComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'cart', component: CartComponent },
  { path: 'create-account', component: CreateAccountComponent },
  { path: 'gold-bars', component: GoldBarsComponent },
  { path: 'gold-coins', component: GoldCoinsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'product-details/:id', component: ProductDetailsComponent },
  { path: 'profile', component: ProfileComponent },
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
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
