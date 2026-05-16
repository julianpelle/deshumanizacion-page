import { AfterViewInit, Component } from '@angular/core';
import { KalvarPicturesPageComponent } from './pages/kalvar-pictures-page/kalvar-pictures-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { OwnGalleryComponent } from './pages/own-gallery/own-gallery.component';


@Component({
  selector: 'app-root',
  imports: [HomePageComponent,KalvarPicturesPageComponent,OwnGalleryComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
title = 'Deshumanizacion';
ngAfterViewInit(): void {
  const reveals = document.querySelectorAll('.reveal');

  // Función para activar elementos visibles
  const activateVisible = () => {
    reveals.forEach(el => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      // Si el elemento está dentro del viewport (aunque sea parcialmente)
      if (rect.top < windowHeight - 50 && rect.bottom > 0) {
        el.classList.add('active');
      }
    });
  };

  // Observer para elementos que entran después del scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Opcional: dejar de observar para rendimiento
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "20px 0px 20px 0px" }); // margen para detectar antes

  reveals.forEach(el => observer.observe(el));

  // Activar inmediatamente los que ya son visibles
  activateVisible();
  // También al hacer scroll (por si acaso)
  window.addEventListener('scroll', activateVisible);
  window.addEventListener('resize', activateVisible);
}
}
