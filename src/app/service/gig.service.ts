import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gig } from '../model/Gig';

@Injectable({
  providedIn: 'root'
})
export class GigService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getAllGigs(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/gigs`); 
  }
  getGigById(id: number): Observable<Gig> {
    return this.http.get<Gig>(`${this.apiUrl}/gigs/${id}`);
}
  // Fetch gigs by creator's email
  getGigsByCreator(email: string): Observable<Gig[]> {
    return this.http.get<Gig[]>(`${this.apiUrl}/gigs/creator/${email}`);
  }

  // Create a new gig
  createGig(newGig: Gig): Observable<Gig> {
    return this.http.post<Gig>(`${this.apiUrl}/gigs`, newGig);
  }

  // Keep your existing methods intact...
  // For example, the searchGigs method you already have
  searchGigs(title: string, minPrice: number, maxPrice: number, skills: string[]): Observable<any> {
    let params = new HttpParams()
      .set('title', title)
      .set('minPrice', minPrice.toString())
      .set('maxPrice', maxPrice.toString());

    skills.forEach(skill => {
      params = params.append('skills', skill);
    });

    return this.http.get<any>(`${this.apiUrl}/gigs/search`, { params });
  }
// Add the updateGig method
updateGig(gig: Gig): Observable<Gig> {
  return this.http.put<Gig>(`${this.apiUrl}/${gig.id}`, gig);
}
  deleteGig(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/gigs/${id}`);
  }
}
