import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { KalvarPicturesPageComponent } from './pages/kalvar-pictures-page/kalvar-pictures-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent }, // Esto ya lo renderiza dentro del outlet
  { path: 'kalvar', component: KalvarPicturesPageComponent },
  // ... otras rutas
];
