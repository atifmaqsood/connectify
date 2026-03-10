import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup.component';
import { FeedComponent } from './feed/feed.component';
import { MarketplaceComponent } from './marketplace/marketplace';
import { VidsComponent } from './vids/vids';
import { GroupsComponent } from './groups/groups';
import { GamingComponent } from './gaming/gaming';
import { ProfileComponent } from './profile/profile.component';
import { ShellComponent } from './shell/shell';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth/login',
    component: LoginComponent
  },
  {
    path: 'auth/signup',
    component: SignupComponent
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: FeedComponent
      },
      {
        path: 'videos',
        component: VidsComponent
      },
      {
        path: 'marketplace',
        component: MarketplaceComponent
      },
      {
        path: 'groups',
        component: GroupsComponent
      },
      {
        path: 'gaming',
        component: GamingComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];