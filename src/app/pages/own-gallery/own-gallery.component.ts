import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { forkJoin } from 'rxjs';
import { PicturesServiceService } from '../../services/pictures-service.service';

interface ImagenCloudinary {
  public_id: string;
  secure_url: string;
  asset_folder: string;
  display_name: string;
  explicacion?: string;
  display_key?: string;
}

interface FolderAgrupada {
  titulo: string;
  general: string;
  imagenes: ImagenCloudinary[];
}

@Component({
  selector: 'app-own-gallery',
  imports: [],
  templateUrl: './own-gallery.component.html',
  styleUrl: './own-gallery.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush // ✅ Mejora rendimiento
})
export class OwnGalleryComponent implements OnInit {
  galeriaEstructurada: FolderAgrupada[] = [];
  indiceFolderActual = 0;
  indiceImagenActual = 0;
  folderActual: FolderAgrupada | null = null;
  imagenActual: ImagenCloudinary | null = null;
currentFolderIndex: number = 0;

  constructor(
    private picturesService: PicturesServiceService,
    private cdr: ChangeDetectorRef // ✅ Para forzar actualización de la vista
  ) {}

  ngOnInit(): void {
    forkJoin({
      fotosCloudinary: this.picturesService.getAllPicturesByFolders('prod_1'),
      fotosCloudinary1: this.picturesService.getAllPicturesByFolders('err_prod'),
      fotosCloudinary2: this.picturesService.getAllPicturesByFolders('ensayo_prod'),
      folderData: this.picturesService.getFolderData()
    }).subscribe(({ fotosCloudinary, fotosCloudinary1, fotosCloudinary2, folderData }) => {
      const todasLasFotos = [
        ...fotosCloudinary,
        ...fotosCloudinary1,
        ...fotosCloudinary2
      ];

      this.armarEstructuraGaleria(todasLasFotos, folderData);
      this.actualizarVista();

      // ✅ Pre‑carga TOTAL: todas las imágenes una vez (opcional pero muy efectivo)
      this.preloadAllImages(todasLasFotos.map(f => f.secure_url));

      // ✅ Pre‑carga dinámica: imágenes de la carpeta actual + siguiente carpeta
      this.preloadAdjacentFolders();
    });
  }

  // ------------------------------------------------------------
  // Pre‑carga total (todas las imágenes en segundo plano)
  // ------------------------------------------------------------
  private preloadAllImages(urls: string[]): void {
    urls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }

  // ------------------------------------------------------------
  // Pre‑carga una única imagen
  // ------------------------------------------------------------
  private preloadImage(url: string): void {
    if (!url) return;
    const img = new Image();
    img.src = url;
  }

  // ------------------------------------------------------------
  // Pre‑carga la imagen siguiente de la carpeta actual
  // y la primera imagen de la carpeta siguiente (si existe)
  // ------------------------------------------------------------
  private preloadAdjacentContent(): void {
    // Pre‑cargar siguiente imagen de la carpeta actual
    if (this.folderActual && this.folderActual.imagenes.length > 0) {
      const nextImgIndex = (this.indiceImagenActual + 1) % this.folderActual.imagenes.length;
      const nextImgUrl = this.folderActual.imagenes[nextImgIndex]?.secure_url;
      if (nextImgUrl) this.preloadImage(nextImgUrl);
    }

    // Pre‑cargar primera imagen de la siguiente carpeta
    const nextFolderIndex = (this.indiceFolderActual + 1) % this.galeriaEstructurada.length;
    const nextFolder = this.galeriaEstructurada[nextFolderIndex];
    if (nextFolder && nextFolder.imagenes.length > 0) {
      const firstImgNextFolder = nextFolder.imagenes[0]?.secure_url;
      if (firstImgNextFolder) this.preloadImage(firstImgNextFolder);
    }

    // Opcional: también pre‑cargar primera imagen de la carpeta anterior
    const prevFolderIndex = (this.indiceFolderActual - 1 + this.galeriaEstructurada.length) % this.galeriaEstructurada.length;
    const prevFolder = this.galeriaEstructurada[prevFolderIndex];
    if (prevFolder && prevFolder.imagenes.length > 0) {
      const firstImgPrevFolder = prevFolder.imagenes[0]?.secure_url;
      if (firstImgPrevFolder) this.preloadImage(firstImgPrevFolder);
    }
  }

  // ------------------------------------------------------------
  // Pre‑carga todas las imágenes de la carpeta actual y las adyacentes
  // (se llama al iniciar y después de cambiar de carpeta)
  // ------------------------------------------------------------
  private preloadAdjacentFolders(): void {
    if (!this.folderActual) return;

    // Imágenes de la carpeta actual
    this.folderActual.imagenes.forEach(img => this.preloadImage(img.secure_url));

    // Carpeta siguiente
    const nextIndex = (this.indiceFolderActual + 1) % this.galeriaEstructurada.length;
    const nextFolder = this.galeriaEstructurada[nextIndex];
    if (nextFolder) {
      nextFolder.imagenes.forEach(img => this.preloadImage(img.secure_url));
    }

    // Carpeta anterior
    const prevIndex = (this.indiceFolderActual - 1 + this.galeriaEstructurada.length) % this.galeriaEstructurada.length;
    const prevFolder = this.galeriaEstructurada[prevIndex];
    if (prevFolder) {
      prevFolder.imagenes.forEach(img => this.preloadImage(img.secure_url));
    }
  }

  // ------------------------------------------------------------
  // Lógica original (armar estructura, actualizar vista)
  // ------------------------------------------------------------
  private armarEstructuraGaleria(fotos: any[], estructuraJson: any[]): void {
    const fotosNormalizadas = fotos.map(f => ({
      ...f,
      display_key: (f.display_name || '').toLowerCase().trim()
    }));

    const fotosPorCarpeta = new Map<string, any[]>();
    for (const foto of fotosNormalizadas) {
      if (!fotosPorCarpeta.has(foto.asset_folder)) {
        fotosPorCarpeta.set(foto.asset_folder, []);
      }
      fotosPorCarpeta.get(foto.asset_folder)!.push(foto);
    }

    this.galeriaEstructurada = estructuraJson
      .map(folder => {
        const fotosDeCarpeta = fotosPorCarpeta.get(folder.titulo) || [];
        const imagenes = fotosDeCarpeta.map(foto => {
          const detalle = folder.detalles?.find(
            (d: any) => (d.display_name || '').toLowerCase().trim() === foto.display_key
          );
          return {
            public_id: foto.public_id,
            secure_url: foto.secure_url,
            asset_folder: foto.asset_folder,
            display_name: foto.display_name,
            explicacion: detalle?.explicacion || 'Sin explicación disponible.',
            display_key: foto.display_key
          };
        });
        return {
          titulo: folder.titulo,
          general: folder.general,
          imagenes
        };
      })
      .filter(f => f.imagenes.length > 0);
  }

  private actualizarVista(): void {
    this.folderActual = this.galeriaEstructurada[this.indiceFolderActual] || null;
    this.imagenActual = this.folderActual?.imagenes[this.indiceImagenActual] || null;
    // ✅ Forzar detección de cambios (útil con OnPush)
    this.cdr.detectChanges();
  }

  // ------------------------------------------------------------
  // Navegación con pre‑carga inteligente
  // ------------------------------------------------------------
  cambiarFolder(direccion: number): void {
    const total = this.galeriaEstructurada.length;
    if (!total) return;

    this.indiceFolderActual = (this.indiceFolderActual + direccion + total) % total;
    this.indiceImagenActual = 0;
    this.actualizarVista();

    // ✅ Pre‑cargar carpetas adyacentes (incluye la nueva carpeta actual)
    this.preloadAdjacentFolders();
    // ✅ También pre‑cargar contenido inmediato (siguiente imagen, etc.)
    this.preloadAdjacentContent();
  }

  cambiarImagen(direccion: number): void {
    const total = this.folderActual?.imagenes.length || 0;
    if (!total) return;

    this.indiceImagenActual = (this.indiceImagenActual + direccion + total) % total;
    this.actualizarVista();

    // ✅ Pre‑cargar siguiente imagen y siguiente carpeta
    this.preloadAdjacentContent();
  }

  saltarSiguienteDisplayName(): void {
    const folder = this.folderActual;
    if (!folder) return;

    const current = this.imagenActual?.display_key;
    const imgs = folder.imagenes;

    for (let i = 1; i < imgs.length; i++) {
      const idx = (this.indiceImagenActual + i) % imgs.length;
      if (imgs[idx].display_key !== current) {
        this.indiceImagenActual = idx;
        break;
      }
    }

    this.actualizarVista();
    this.preloadAdjacentContent(); // ✅ También pre‑cargar después del salto
  }


}
