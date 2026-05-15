import { AfterViewInit, Component } from '@angular/core';
import { KalvarPicturesPageComponent } from './pages/kalvar-pictures-page/kalvar-pictures-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';

@Component({
  selector: 'app-root',
  imports: [HomePageComponent,KalvarPicturesPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
title = 'Deshumanizacion';
   ngAfterViewInit(): void {

    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.classList.add('active');

        } else {

          entry.target.classList.remove('active');

        }

      });

    }, {
      threshold: 0.15
    });

    reveals.forEach(el => observer.observe(el));

  }

}
