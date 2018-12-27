import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordCardComponent } from './password-card.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';

describe('PasswordCardComponent', () => {
  let component: PasswordCardComponent;
  let fixture: ComponentFixture<PasswordCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordCardComponent ],
      imports: [ReactiveFormsModule, ClipboardModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
