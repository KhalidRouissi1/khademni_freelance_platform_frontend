import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gig } from '../model/Gig';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GigService {
  private apiUrl = 'http://localhost:8080/gig/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    console.log(token)

    return new HttpHeaders({
      'Authorization': "Bearer "+token,
      'Content-Type': 'application/json'
    });
  }

  getAllGigs(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/all`, {
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

  createGig(newGig: Gig): Observable<Gig> {
    return this.http.post<Gig>(`${this.apiUrl}/addgig`, newGig, {
      headers: this.getAuthHeaders()
    });
  }

  searchGigs(title: string, minPrice: number, maxPrice: number, skills: string[]): Observable<any> {
    let params = new HttpParams()
      .set('title', title)
      .set('minPrice', minPrice.toString())
      .set('maxPrice', maxPrice.toString());
    
    skills.forEach(skill => {
      params = params.append('skills', skill);
    });

    return this.http.get<any>(`${this.apiUrl}/gigs/search`, {
      headers: this.getAuthHeaders(),
      params
    });
  }

  updateGig(gig: Gig): Observable<Gig> {
    return this.http.put<Gig>(`${this.apiUrl}/gigs/${gig.id}`, gig, {
      headers: this.getAuthHeaders()
    });
  }

  deleteGig(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/gigs/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}