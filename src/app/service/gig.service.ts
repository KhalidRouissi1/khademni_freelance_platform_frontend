import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gig } from '../model/Gig';
import { AuthService } from './auth.service';
import { Image } from '../model/Image';

@Injectable({
  providedIn: 'root'
})
export class GigService {
  private apiUrl = 'http://localhost:8080/gig/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getAuthHeaders(isFormData: boolean = false): HttpHeaders {
    const token = this.authService.getToken();
    const headers: any = {
      'Authorization': `Bearer ${token}`
    };
    
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    
    return new HttpHeaders(headers);
  }

  getAllGigs(): Observable<Gig[]> {
    return this.http.get<Gig[]>(`${this.apiUrl}/all`, {
      headers: this.getAuthHeaders()
    });
  }

  getGigById(id: number): Observable<Gig> {
    return this.http.get<Gig>(`${this.apiUrl}/getbyid/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  getGigsByCreator(username: string): Observable<Gig[]> {
    return this.http.get<Gig[]>(`${this.apiUrl}/creator/${username}`, {
      headers: this.getAuthHeaders()
    });
  }

  createGig(gig: Gig): Observable<Gig> {
    const url = `${this.apiUrl}/addgig`;
    return this.http.post<Gig>(url, gig, {
      headers: this.getAuthHeaders()
    });
  }

  updateGig(gig: Gig, image: File | null): Observable<Gig> {
    const formData = new FormData();
    formData.append('title', gig.title);
    formData.append('description', gig.description);
    formData.append('minPrice', gig.minPrice.toString());
    formData.append('maxPrice', gig.maxPrice.toString());
    formData.append('username', gig.username);
    formData.append('requiredSkills', JSON.stringify(gig.requiredSkills));
    
    if (image) {
      formData.append('image', image);
    }

    return this.http.put<Gig>(`${this.apiUrl}/gigs/${gig.id}`, formData, {
      headers: this.getAuthHeaders(true)
    });
  }

  deleteGig(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/gigs/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
  uploadImage(file: File, filename: string): Observable<any> {
    const imageFormData = new FormData();
    imageFormData.append('image', file, filename);
    const url = `${this.apiUrl}/image/upload`;
    return this.http.post(url, imageFormData, {
      headers: this.getAuthHeaders(true)  
    });
  }
  
  loadImage(id: number): Observable<Image> {
    const url = `${this.apiUrl}/image/get/info/${id}`;
    return this.http.get<Image>(url);
  }
  
}
