import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PicturesServiceService {

  private urlBase = environment.urlBase;


  constructor(private http: HttpClient) {}

pingBackend() {
  return this.http.get<{ ok: boolean }>(
    `${this.urlBase}/api/ping`
  );
}

  getAllPicturesByFolders(NameFolder:string):Observable<any[]> {
  return this.http.get<string[]>(`${this.urlBase}/fotos/${NameFolder}`);
}
 getImagesData(): Observable<any[]> {
    return this.http.get<any[]>(
      'imagedata.json'
    );
  }
 getFolderData(): Observable<any[]> {
    return this.http.get<any[]>(
      'folderdata.json'
    );
}
 getAnalisisData(): Observable<any[]> {
    return this.http.get<any[]>(
      'analysis.json'
    );
}
 getTrialData(): Observable<any[]> {
    return this.http.get<any[]>(
      'trialdata.json'
    );
}
 getVidData(): Observable<any[]> {
    return this.http.get<any[]>(
      'viddata.json'
    );
}
}
