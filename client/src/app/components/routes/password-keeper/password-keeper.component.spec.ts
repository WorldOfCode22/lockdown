import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordKeeperComponent } from './password-keeper.component';
import { PasswordCardComponent } from '../../util/password-card/password-card.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('PasswordKeeperComponent', () => {
  let component: PasswordKeeperComponent;
  let fixture: ComponentFixture<PasswordKeeperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordKeeperComponent, PasswordCardComponent ],
      imports: [ReactiveFormsModule]
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
