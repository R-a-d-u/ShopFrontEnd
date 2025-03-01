import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router'; // Import RouterModule
import { AppRoutingModule } from './app-routing.module'; // Import AppRoutingModule
import { HttpClientModule } from '@angular/common/http'; // Add this import
//import { HomeComponent } from './home.component'; // Import HomeComponent

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { JewelryComponent } from './components/jewelry/jewelry.component';
import { FooterComponent } from './components/footer/footer.component';
import { CartComponent } from './components/cart/cart.component';
import { GoldBarsComponent } from './components/gold-bars/gold-bars.component';
import { GoldCoinsComponent } from './components/gold-coins/gold-coins.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { LoginComponent } from './components/login/login.component';
import { CreateAccountComponent } from './components/create-account/create-account.component';
import { AdminComponent } from './components/admin/admin.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    JewelryComponent,
    FooterComponent,
    CartComponent,
    GoldBarsComponent,
    GoldCoinsComponent,
    ProductDetailsComponent,
    LoginComponent,
    CreateAccountComponent,
    AdminComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
