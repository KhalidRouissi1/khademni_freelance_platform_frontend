import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Gig } from '../../model/Gig';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GigService } from '../../service/gig.service';
import { UserResponse } from '../../model/UserResponse';

@Component({
  selector: 'app-owner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './owner.component.html'
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
    username: '',
    createdAt: new Date(),
  };
  uploadedImage!: File;
  imagePath: any;
  
  currentUser: UserResponse | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private authService: AuthService,
    private gigService: GigService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      if (this.currentUser) {
        this.loadGigs(this.currentUser.username);
      }
    });
  }

  loadGigs(userId: string) {
    this.gigService.getGigsByCreator(userId).subscribe((gigs) => {
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
      username: '',
      createdAt: new Date(),
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
    console.log(this.currentUser)
    if (!this.currentUser) return;
  
    // Ensure skills are parsed correctly
    this.editingGig.requiredSkills = this.skillsInput
     .split(',')
     .map(skill => skill.trim())
     .filter(skill => skill.length > 0);
    console.log('Skills:', this.editingGig.requiredSkills);
  
    // Add the current username to the gig
    this.editingGig.username = this.currentUser.username;
  
    // Log uploaded image and gig data
    console.log('Gig data:', this.editingGig);
    console.log('Uploaded Image:', this.uploadedImage);
  
    // Send the image separately
    this.gigService.uploadImage(this.uploadedImage, this.uploadedImage.name).subscribe((imageResponse) => {
      console.log('Image uploaded:', imageResponse);
  
      // Send the gig data without the image
      this.gigService.createGig(this.editingGig).subscribe((newGig) => {
        this.myGigs.push(newGig);
        this.closeModal();
      }, (error) => console.error('Error creating gig:', error));
    }, (error) => console.error('Error uploading image:', error));
  }
  
  deleteGig(id: number) {
    if (confirm('Are you sure you want to delete this gig?')) {
      this.gigService.deleteGig(id).subscribe(() => {
        this.myGigs = this.myGigs.filter((gig) => gig.id !== id);
      });
    }
  }

  onImageUpload(event: any) {
    this.uploadedImage = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.uploadedImage);
    console.log(reader)

    reader.onload = (_event) => {
      this.imagePath = reader.result;
    };

  }
  // In your component
previewImage(file: File): string {
  return URL.createObjectURL(file);
}

}
