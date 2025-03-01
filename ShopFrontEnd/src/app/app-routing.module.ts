import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../app/components/home/home.component'; // Import your HomeComponent
import { JewelryComponent } from '../app/components/jewelry/jewelry.component'; // Import your HomeComponent

const routes: Routes = [
  { path: '', component: HomeComponent }, // Root path
  { path: 'jewelry', component: JewelryComponent }, // Root path
  { path: '**', redirectTo: '', pathMatch: 'full' } // Redirect unknown routes to home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
