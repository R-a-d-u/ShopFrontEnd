import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
// Components
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
import { GoldGraphComponent } from './components/gold-graph/gold-graph.component'; // Needed for menu trigger

// Services and Guards
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ProfileComponent } from './components/profile/profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
import { OrderComponent } from './components/order/order.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ProductAdministrationComponent } from './components/product-administration/product-administration.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { CategoryAdministrationComponent } from './components/category-administration/category-administration.component';
import { AddCategoryComponent } from './components/add-category/add-category.component';
import { UserAdministrationComponent } from './components/user-administration/user-administration.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { PdfGeneratorComponent } from './shared/pdf-generator/pdf-generator.component';

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
    ProfileComponent,
    GoldGraphComponent,
    MyOrdersComponent,
    OrderComponent,
    CheckoutComponent,
    ProductAdministrationComponent,
    AddProductComponent,
    EditProductComponent,
    CategoryAdministrationComponent,
    AddCategoryComponent,
    UserAdministrationComponent,
    AddUserComponent,
    PdfGeneratorComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, // Required for Angular Material animations
    MatMenuModule,
    MatButtonModule,
    CanvasJSAngularChartsModule,
    ToastModule
  ],
  providers: [
    AuthService,
    MessageService,
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }