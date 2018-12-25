import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/util/navbar/navbar.component';
import { LoginComponent } from './components/routes/login/login.component';
import { MockApiService } from './mocks/services/mock-api.service';
import { PasswordKeeperComponent } from './components/routes/password-keeper/password-keeper.component';
import { PasswordCardComponent } from './components/util/password-card/password-card.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    PasswordKeeperComponent,
    PasswordCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [MockApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
