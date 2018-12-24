import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordKeeperComponent } from './password-keeper.component';

describe('PasswordKeeperComponent', () => {
  let component: PasswordKeeperComponent;
  let fixture: ComponentFixture<PasswordKeeperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordKeeperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordKeeperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
