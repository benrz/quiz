import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { QuizComponent } from './quiz/quiz.component';
import { HttpClientModule } from '@angular/common/http';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { HomepageComponent } from './homepage/homepage.component';

import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule, FirebaseNameOrConfigToken } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { AppRoutingModule } from './app-routing.module';
import { HomepageService } from './homepage/homepage.service';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    QuizComponent,
    PagenotfoundComponent,
    HomepageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,    
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule
  ],
  providers: [HomepageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
