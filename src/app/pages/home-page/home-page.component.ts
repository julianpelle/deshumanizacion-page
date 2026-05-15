import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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

            console.log(this.video);

          }

        },

        error: (err) => console.error(err)

      });

  }

}



