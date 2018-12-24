import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { MockApiService } from '../mocks/services/mock-api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, private api: MockApiService) { }

  canActivate() {
    if (this.api.HasApiKey()) {return true; }
    this.router.navigate(['/login']);
    return false;
  }
}
