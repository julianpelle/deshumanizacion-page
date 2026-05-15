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

  getAllPicturesByFolders(NameFolder:string):Observable<any[]> {
  return this.http.get<string[]>(`${this.urlBase}/${NameFolder}`);
}
}

