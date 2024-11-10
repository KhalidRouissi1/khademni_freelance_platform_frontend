import { Component, OnInit } from '@angular/core';
import { Gig } from '../../model/Gig';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GigService } from '../../service/gig.service';

@Component({
  selector: 'app-owner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './owner.component.html',
  styleUrl: './owner.component.css'
})
export class OwnerComponent implements OnInit {
  myGigs: Gig[] = [];
  showModal = false;
  isEditing = false;
  skillsInput = '';
  
  editingGig: Gig = {
    id: 0,
    title: '',
    description: '',
    requiredSkills: [],
    maxPrice: 0,
    minPrice: 0,
    creatorEmail: '',
    createdAt: new Date()
  };

  constructor(
    private authService: AuthService,
    private gigService: GigService
  ) {}

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.loadGigs(currentUser.email);
    }
  }

  loadGigs(email: string) {
    this.gigService.getGigsByCreator(email).subscribe(gigs => {
      this.myGigs = gigs;
    });
  }

  openCreateModal() {
    this.isEditing = false;
    this.editingGig = {
      id: 0,
      title: '',
      description: '',
      requiredSkills: [],
      maxPrice: 0,
      minPrice: 0,
      creatorEmail: '',
      createdAt: new Date()
    };
    this.skillsInput = '';
    this.showModal = true;
  }

  openEditModal(gig: Gig) {
    this.isEditing = true;
    this.editingGig = { ...gig };
    this.skillsInput = gig.requiredSkills.join(', ');
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.isEditing = false;
  }

  submitForm(event: Event) {
    event.preventDefault();
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.editingGig.requiredSkills = this.skillsInput
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);

    if (!this.isEditing) {
      this.editingGig.creatorEmail = currentUser.email;
      this.gigService.createGig(this.editingGig).subscribe(createdGig => {
        this.myGigs = [...this.myGigs, createdGig];
        this.closeModal();
      });
    } else {
      this.gigService.updateGig(this.editingGig).subscribe(updatedGig => {
        this.myGigs = this.myGigs.map(gig => 
          gig.id === updatedGig.id ? updatedGig : gig
        );
        this.closeModal();
      });
    }
  }

  deleteGig(id: number) {
    if (confirm('Are you sure you want to delete this gig?')) {
      this.gigService.deleteGig(id).subscribe(() => {
        this.myGigs = this.myGigs.filter(gig => gig.id !== id);
      });
    }
  }
}
