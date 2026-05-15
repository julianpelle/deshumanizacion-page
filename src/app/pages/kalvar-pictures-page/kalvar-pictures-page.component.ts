import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { forkJoin } from 'rxjs';
import { PicturesServiceService } from '../../services/pictures-service.service';

@Component({
  selector: 'app-kalvar-pictures-page',
  imports: [],
  templateUrl: './kalvar-pictures-page.component.html',
  styleUrl: './kalvar-pictures-page.component.css'
})
export class KalvarPicturesPageComponent {
isClosing = false;

  images: any[] = [];

  jsonData: any[] = [];

  diagramImages: any[] = [];

  selectedImage: any = null;

  selectedExplanation: string = '';
@ViewChildren('cardElement') cardElements!: QueryList<ElementRef>;

// Método para hacer scroll centrado
private scrollToCard(index: number): void {
  const cards = this.cardElements.toArray();
  if (cards[index] && cards[index].nativeElement) {
    cards[index].nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',    // evita scroll vertical innecesario
      inline: 'center'     // centra horizontalmente en el carrusel
    });
  }
}
  constructor(
    private picturesService: PicturesServiceService
  ) {}

  ngOnInit(): void {

    forkJoin({

      images: this.picturesService.getAllPicturesByFolders('kalvar'),
      diagramImages: this.picturesService.getAllPicturesByFolders('diagrama'),
      json: this.picturesService.getImagesData()

    }).subscribe({

      next: ({ images, diagramImages, json }) => {

        this.images = images;
        this.diagramImages = diagramImages;
        this.jsonData = json;

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

selectImage(image: any, index: number): void {  // necesitas pasar el índice

  const isSame = this.selectedImage?.public_id === image.public_id;

  // 👉 cerrar si clickea la misma
  if (isSame) {

    this.isClosing = true;

    setTimeout(() => {
      this.selectedImage = null;
      this.selectedExplanation = '';
      this.isClosing = false;
    }, 300);

    return;
  }

  // 👉 si ya hay una abierta, hacemos fade-out primero
  if (this.selectedImage) {


    this.isClosing = true;

    setTimeout(() => {

      this.selectedImage = image;
this.scrollToCard(index);   // ← AÑADE ESTA LÍNEA

      const imageTitle = image.display_name
        ?.toLowerCase()
        .trim();

      const match = this.jsonData.find(
        item => item.titulo.toLowerCase().trim() === imageTitle
      );

      this.selectedExplanation =
        match?.explicacion || 'Sin explicación disponible.';

      this.isClosing = false;

    }, 300);

    return;
  }

  this.selectedImage = image;
this.scrollToCard(index);   // ← AÑADE ESTA LÍNEA

  const imageTitle = image.display_name
    ?.toLowerCase()
    .trim();

  const match = this.jsonData.find(
    item => item.titulo.toLowerCase().trim() === imageTitle
  );

  this.selectedExplanation =
    match?.explicacion || 'Sin explicación disponible.';
}
}
