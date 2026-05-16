import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { PicturesServiceService } from '../../services/pictures-service.service';

interface ImagenCloudinary {
  secure_url: string;
  display_name: string;
  asset_folder: string;
}

interface AnalisisJson {
  titulo: string;
  display_name: string;
  explicacion: string;
}

interface ImagenAnalisis {
  secure_url: string;
  display_name: string;
  asset_folder: string;
  explicacion?: string;
}

@Component({
  selector: 'app-analysis-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analysis-page.component.html',
  styleUrl: './analysis-page.component.css'
})
export class AnalysisPageComponent {

  analisis: ImagenAnalisis[] = [];

  constructor(
    private picturesService: PicturesServiceService
  ) {}

  ngOnInit(): void {

    forkJoin({

      imagenes: this.picturesService.getAllPicturesByFolders('analisis'),

      json: this.picturesService.getAnalisisData()

    }).subscribe({

      next: ({ imagenes, json }) => {

        const analisisJson = json.filter(
          (item: AnalisisJson) => item.titulo === 'analisis'
        );

        this.analisis = imagenes.map((img: ImagenCloudinary) => {

          const info = analisisJson.find(
            (j: AnalisisJson) =>
              j.display_name.toLowerCase().trim() ===
              img.display_name.toLowerCase().trim()
          );

          return {
            ...img,
            explicacion: info?.explicacion || 'Sin explicación'
          };

        });

        console.log(this.analisis);

      },

      error: (err) => console.error(err)

    });

  }

}
