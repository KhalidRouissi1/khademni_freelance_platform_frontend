import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GigService } from '../../../service/gig.service';
import { Gig } from '../../../model/Gig';
import { AuthService } from '../../../service/auth.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-gig-list',
  templateUrl: './gig-list.component.component.html',
  imports: [CommonModule, FormsModule],
  standalone: true,
  styleUrls: ['./gig-list.component.component.css']
})
export class GigListComponent implements OnInit {
  allGigs: Gig[] = [];
  filteredGigs: Gig[] = [];
  displayedGigs: Gig[] = [];
  selectedGig: Gig | null = null;
  showDialog = false;
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  titleFilter = '';
  skillsFilter = '';
  minPrice = 0;
  maxPrice = 2000;
  

  constructor(
    private router: Router,
    private gigService: GigService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadGigs();
  }

  loadGigs(): void {
    this.gigService.getAllGigs().subscribe(response => {
      this.allGigs = response;
      this.applyFilters();
    });
  }

  searchGigs(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    const skills = this.skillsFilter
      .split(',')
      .map(skill => skill.trim().toLowerCase())
      .filter(skill => skill.length > 0);

    this.filteredGigs = this.allGigs.filter(gig => {
      const titleMatch = gig.title.toLowerCase().includes(this.titleFilter.toLowerCase());
      const priceMatch = gig.maxPrice >= this.minPrice && gig.minPrice <= this.maxPrice;
      const skillsMatch = skills.length === 0 || gig.requiredSkills.some(skill => 
        skills.includes(skill.toLowerCase())
      );
      return titleMatch && priceMatch && skillsMatch;
    });

    this.totalPages = Math.ceil(this.filteredGigs.length / this.pageSize);
    this.currentPage = 0;
    this.displayPage();
  }

  displayPage(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.displayedGigs = this.filteredGigs.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.displayPage();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.displayPage();
    }
  }

  openGigDetails(gigId: number): void {
    console.log('Button clicked, gigId:', gigId);
    this.gigService.getGigById(gigId).subscribe(response => {
        this.selectedGig = response;
        this.showDialog = true;
    });
  }

  closeDialog(): void {
    this.showDialog = false;
    // this.selectedGig = null;
  }


  logout(): void {
    this.authService.logout();
  }
  
  applyToGig(): void {
    console.log(this.selectedGig)
    if (this.selectedGig) {
      this.closeDialog(); 
      this.router.navigate(['/gigs/details', this.selectedGig.id]);  
    }
  }
  trackByGigId(index: number, gig: Gig): number {
    return gig.id;
  }
  
}