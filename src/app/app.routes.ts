import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { GigListComponent } from './components/gig-list/gig-list.component/gig-list.component.component';
import { AuthGuard } from './guards/auth.guard';
import { OwnerComponent } from './components/owner/owner.component';
import { GigDetailsComponent } from './components/gig-details/gig-details.component';
import { RegisterComponent } from './components/register/register.component';
import { VerifEmailComponent } from './components/verif-email/verif-email.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'gigs', component: GigListComponent, canActivate: [AuthGuard] },
  { path: 'ownerspace', component: OwnerComponent, canActivate: [AuthGuard] },
  { path: 'verifemail', component: VerifEmailComponent },
  { path: 'gigs/details/:id', component: GigDetailsComponent, canActivate: [AuthGuard] }
];