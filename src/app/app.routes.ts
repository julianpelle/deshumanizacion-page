import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { OwnGalleryComponent } from './pages/own-gallery/own-gallery.component';

export const routes: Routes = [
  { path: '', component: OwnGalleryComponent }, // Esto ya lo renderiza dentro del outlet
  { path: 'owng', component: OwnGalleryComponent }

];
