import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { PicturesServiceService } from '../../services/pictures-service.service';

interface VideoCloudinary {
  public_id: string;
  secure_url: string;
  asset_folder: string;
  display_name: string;
  explicacion?: string;
  display_key?: string;
}

@Component({
  selector: 'app-own-videos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './own-videos.component.html',
  styleUrl: './own-videos.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OwnVideosComponent implements OnInit {

  videos: VideoCloudinary[] = [];

  indiceVideoActual = 0;
  videoActual: VideoCloudinary | null = null;

  constructor(
    private picturesService: PicturesServiceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    forkJoin({
      videosCloudinary: this.picturesService.getAllPicturesByFolders('vid2'),
      videosData: this.picturesService.getVidData()
    }).subscribe(({ videosCloudinary, videosData }) => {

      this.armarVideos(videosCloudinary, videosData);

      this.actualizarVista();

      // ✅ preload inicial
      this.preloadAllVideos(
        this.videos.map(v => v.secure_url)
      );

      // ✅ preload dinámico
      this.preloadAdjacentVideos();

    });

  }

  // ============================================================
  // ARMAR DATA
  // ============================================================

  private armarVideos(
    cloudinaryVideos: any[],
    videosJson: any[]
  ): void {

    const normalizados = cloudinaryVideos.map(video => ({

      ...video,

      display_key: (video.display_name || '')
        .toLowerCase()
        .trim()

    }));

    this.videos = normalizados.map(video => {

      const detalle = videosJson.find(
        (v: any) =>
          (v.titulo || '')
            .toLowerCase()
            .trim() === video.display_key
      );

      return {

        public_id: video.public_id,
        secure_url: video.secure_url,
        asset_folder: video.asset_folder,
        display_name: video.display_name,

        explicacion:
          detalle?.explicacion ||
          'Sin explicación disponible.',

        display_key: video.display_key

      };

    });

  }

  // ============================================================
  // ACTUALIZAR VISTA
  // ============================================================

  private actualizarVista(): void {

    this.videoActual =
      this.videos[this.indiceVideoActual] || null;

    this.cdr.detectChanges();

  }

  // ============================================================
  // NAVEGACION
  // ============================================================

  cambiarVideo(direccion: number): void {

    const total = this.videos.length;

    if (!total) return;

    this.indiceVideoActual =
      (this.indiceVideoActual + direccion + total) % total;

    this.actualizarVista();

    this.preloadAdjacentVideos();

  }

  // ============================================================
  // PRELOAD TOTAL
  // ============================================================

  private preloadAllVideos(urls: string[]): void {

    urls.forEach(url => {

      const video = document.createElement('video');

      video.src = url;

      video.preload = 'auto';

    });

  }

  // ============================================================
  // PRELOAD ADYACENTES
  // ============================================================

  private preloadAdjacentVideos(): void {

    const total = this.videos.length;

    if (!total) return;

    const nextIndex =
      (this.indiceVideoActual + 1) % total;

    const prevIndex =
      (this.indiceVideoActual - 1 + total) % total;

    const nextVideo = this.videos[nextIndex];
    const prevVideo = this.videos[prevIndex];

    [nextVideo, prevVideo].forEach(videoData => {

      if (!videoData?.secure_url) return;

      const video = document.createElement('video');

      video.src = videoData.secure_url;

      video.preload = 'auto';

    });

  }
touchStartX = 0;
touchEndX = 0;

onTouchStart(event: TouchEvent): void {
  this.touchStartX = event.changedTouches[0].screenX;
}

onTouchEnd(event: TouchEvent): void {
  this.touchEndX = event.changedTouches[0].screenX;
  this.handleSwipe();
}

handleSwipe(): void {

  const diff =
    this.touchStartX - this.touchEndX;

  // swipe izquierda -> siguiente
  if (diff > 50) {

    this.cambiarVideo(1);

  }

  // swipe derecha -> anterior
  if (diff < -50) {

    this.cambiarVideo(-1);

  }

}
}
