import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthComponent } from '../../routes/auth/auth.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let debug: DebugElement;
  let location: Location;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatMenuModule,
        MatIconModule,
        MatToolbarModule,
        NoopAnimationsModule,
        MatButtonToggleModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        RouterTestingModule.withRoutes([
          {path: 'auth', component: AuthComponent}
        ])
      ],
      declarations: [ NavbarComponent, AuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    debug = fixture.debugElement;
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    fixture.autoDetectChanges(true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with menu closed', () => {
    const menu = debug.queryAll(By.css('.mat-menu-item'));
    expect(menu.length).toEqual(0);
  });

  it('Should open menu on toggle click', () => {
    component.appMenuTrigger.openMenu();
    const menu = debug.queryAll(By.css('.mat-menu-item'));
    expect(menu.length).toEqual(1);
  });

  it('Should navigate to /auth menu item when auth is clicked', fakeAsync(() => {
    component.appMenuTrigger.openMenu();
    const menu = debug.query(By.css('#auth-button'));
    menu.triggerEventHandler('click', null);
    tick(100);
    expect(location.path()).toBe('/auth');
  }));
});
