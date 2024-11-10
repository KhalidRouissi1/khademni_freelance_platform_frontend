import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GigService } from '../../service/gig.service';
import { Gig } from '../../model/Gig';
import { ApplicationService } from '../../service/application.service';
import { AuthService } from '../../service/auth.service';
import { Application } from '../../model/Application';  // Import Application interface
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gig-details',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './gig-details.component.html',
  styleUrls: ['./gig-details.component.css']
})
export class GigDetailsComponent implements OnInit {
  gig: Gig | null = null;
  coverLetter: string = ''; // To bind cover letter input
  resumeUrl: string = ''; // To bind resume URL input
  projectPhotoUrl: string = ''; // To bind project photo URL input

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gigService: GigService,
    private applicationService: ApplicationService,
    private authService: AuthService
  ) {
    // Try to get the gig from router state first
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.gig = navigation.extras.state['gig'] as Gig;
    }
  }

  ngOnInit(): void {
    // If we don't have the gig from router state, fetch it from the API
    if (!this.gig) {
      this.route.params.subscribe(params => {
        const id = +params['id'];
        if (id) {
          this.gigService.getGigById(id).subscribe({
            next: (gig) => {
              this.gig = gig;
            },
            error: (error) => {
              console.error('Error fetching gig:', error);
            }
          });
        }
      });
    }
  }

  sendApplication(): void {
    if (this.gig && this.coverLetter && this.resumeUrl && this.projectPhotoUrl) {
      
      const application: Application = {
        gigId: this.gig.id,
        freelancerId: this.authService.getCurrentUser()?.id as number,
        coverLetter: this.coverLetter,
        resumeUrl: this.resumeUrl,
        projectPhotoUrl: this.projectPhotoUrl,
      };
  
      console.log('Sending application:', application); // Log the data to check its structure
  
      // Send the application
      this.applicationService.sendApplication(application).subscribe({
        next: () => {
          alert('Application sent successfully!');
        },
        error: (error) => {
          console.error('Error sending application:', error);
          alert('There was an error sending your application.');
        }
      });
    } else {
      alert('Please fill in all the fields before submitting.');
    }
  }
  
}
