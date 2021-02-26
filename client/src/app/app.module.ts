import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PollComponent } from './poll/poll.component';
import { HttpClientModule } from '@angular/common/http';
import { VoteComponent } from './vote/vote.component';
import { PollEditComponent } from './poll-edit/poll-edit.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PollRegisterComponent } from './poll-register/poll-register.component';
import { from } from 'rxjs';
import { PollStartComponent } from './poll-start/poll-start.component';

@NgModule({
  declarations: [
    AppComponent,
    PollComponent,
    VoteComponent,
    PollEditComponent,
    PollRegisterComponent,
    PollStartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatExpansionModule,
    MatNativeDateModule,
    MatRadioModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    ClipboardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
