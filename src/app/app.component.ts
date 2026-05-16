import { AfterViewInit, Component, OnInit } from '@angular/core';
import { KalvarPicturesPageComponent } from './pages/kalvar-pictures-page/kalvar-pictures-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { OwnGalleryComponent } from './pages/own-gallery/own-gallery.component';
import { AnalysisPageComponent } from './pages/analysis-page/analysis-page.component';
import { OwnVideosComponent } from './pages/own-videos/own-videos.component';
import { FooterComponent } from "./components/footer/footer.component";


@Component({
  selector: 'app-root',
  imports: [HomePageComponent, KalvarPicturesPageComponent, OwnGalleryComponent, AnalysisPageComponent, OwnVideosComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit, OnInit {
title = 'Deshumanizacion';
ngOnInit(): void {
    // Evita que el navegador restaure la posición del scroll al recargar
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    // Fuerza posición arriba inmediatamente al iniciar el componente
    window.scrollTo(0, 0);
  }

  ngAfterViewInit(): void {
    // También después de que Angular pinte las vistas, aseguramos arriba
    window.scrollTo(0, 0);

    const reveals = document.querySelectorAll('.reveal');

    const activateVisible = () => {
      reveals.forEach(el => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (rect.top < windowHeight - 50 && rect.bottom > 0) {
          el.classList.add('active');
        }
      });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "20px 0px 20px 0px" });

    reveals.forEach(el => observer.observe(el));

    activateVisible();
    window.addEventListener('scroll', activateVisible);
    window.addEventListener('resize', activateVisible);
  }
}

