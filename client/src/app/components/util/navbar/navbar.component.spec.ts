import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let navbarEl: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarComponent ],
      imports: [RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    navbarEl = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle users dropdown', () => {
    const userDropdownToggleEl: HTMLElement = navbarEl.querySelector('#users-dropdown-toggle');
    const userDropdown: HTMLElement = navbarEl.querySelector('#users-dropdown');
    expect(userDropdownToggleEl).toBeTruthy();
    expect(userDropdown).toBeTruthy();
    userDropdownToggleEl.click();
    fixture.detectChanges();
    expect(component.UsersDropdownOpen).toBeTruthy();
    expect(userDropdown.className).toBe('dropdown-menu show');
  });
});
