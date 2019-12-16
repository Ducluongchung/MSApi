import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { DashbroadComponent } from './Components/Admin/dashbroad/dashbroad.component';
import { LoginComponent } from './Components/Admin/login/login.component';
import { RegisterComponent } from './Components/Admin/register/register.component';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: DashbroadComponent },
  { path: 'register', component: RegisterComponent }
];
@NgModule({
  declarations: [
    AppComponent,
    DashbroadComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
    // other imports here
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
