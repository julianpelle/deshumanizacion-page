import { AfterViewInit, Component, OnInit } from '@angular/core';
import { KalvarPicturesPageComponent } from './pages/kalvar-pictures-page/kalvar-pictures-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { OwnGalleryComponent } from './pages/own-gallery/own-gallery.component';
import { AnalysisPageComponent } from './pages/analysis-page/analysis-page.component';
import { OwnVideosComponent } from './pages/own-videos/own-videos.component';
import { FooterComponent } from "./components/footer/footer.component";
import { PicturesServiceService } from './services/pictures-service.service';


@Component({
  selector: 'app-root',
  imports: [HomePageComponent, KalvarPicturesPageComponent, OwnGalleryComponent, AnalysisPageComponent, OwnVideosComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit, OnInit {

  title = 'Deshumanizacion';

  cargado = false;

  constructor(
    private picturesService: PicturesServiceService
  ) {}

  ngOnInit(): void {

    // evita restaurar scroll al refrescar
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    window.scrollTo(0, 0);

    this.esperarBackend();
  }

  ngAfterViewInit(): void {
    window.scrollTo(0, 0);
  }

  // ======================================================
  // ESPERAR BACKEND RENDER
  // ======================================================

  private esperarBackend(): void {

    const intentar = () => {

      console.log('Haciendo ping...');

      this.picturesService.pingBackend().subscribe({

        next: (res) => {

          console.log('NEXT OK');
          console.log('Respuesta del backend:', res);

          if (res.ok) {

            console.log('Backend activo');

            this.cargado = true;

            // esperar que Angular pinte el DOM
            setTimeout(() => {
              this.initRevealAnimations();
            });
          }
        },

        error: (err) => {

          console.log('ERROR BACKEND');
          console.log(err);

          setTimeout(() => {
            intentar();
          }, 3000);
        }
      });
    };

    intentar();
  }

  // ======================================================
  // REVEAL ANIMATIONS
  // ======================================================

  private initRevealAnimations(): void {

    const reveals = document.querySelectorAll('.reveal');

    const activateVisible = () => {

      reveals.forEach(el => {

        const rect = el.getBoundingClientRect();

        const windowHeight = window.innerHeight;

        if (
          rect.top < windowHeight - 50 &&
          rect.bottom > 0
        ) {
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

    }, {
      threshold: 0.1,
      rootMargin: '20px 0px 20px 0px'
    });

    reveals.forEach(el => observer.observe(el));

    activateVisible();

    window.addEventListener('scroll', activateVisible);

    window.addEventListener('resize', activateVisible);
  }
}
