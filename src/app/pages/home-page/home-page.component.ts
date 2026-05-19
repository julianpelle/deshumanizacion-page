import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { PicturesServiceService } from '../../services/pictures-service.service';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
 video: string = '';

  constructor(
    private picturesService: PicturesServiceService
  ) {}

  ngOnInit(): void {

    this.picturesService
      .getAllPicturesByFolders('vid1')
      .subscribe({

        next: (data) => {

          if (data && data.length > 0) {

            this.video = data[0].secure_url;


          }

        },

        error: (err) => console.error(err)

      });

  }
ensayoExpandido: boolean = false;

@ViewChild('videoRef') videoRef!: ElementRef<HTMLDivElement>;

toggleEnsayo(): void {

  this.ensayoExpandido = !this.ensayoExpandido;

  if (!this.ensayoExpandido && this.videoRef) {

    const y =
      this.videoRef.nativeElement.getBoundingClientRect().top
      + window.scrollY
      - 120;

    window.scrollTo({

      top: y,

      behavior: 'smooth'
    });
  }
}
}



