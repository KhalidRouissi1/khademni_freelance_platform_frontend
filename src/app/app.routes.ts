import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { GigListComponent } from './components/gig-list/gig-list.component/gig-list.component.component';
import { AuthGuard } from './guards/auth.guard';
import { OwnerComponent } from './components/owner/owner.component';
import { GigDetailsComponent } from './component/gig-details/gig-details.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'gigs', component: GigListComponent, canActivate: [AuthGuard] },
  { path: 'ownerspace', component: OwnerComponent, canActivate: [AuthGuard] },
  { path: 'gigs/details/:id', component: GigDetailsComponent, canActivate: [AuthGuard] }
];