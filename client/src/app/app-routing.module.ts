import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PollEditComponent } from './poll-edit/poll-edit.component';
import { PollRegisterComponent } from './poll-register/poll-register.component';
import { PollComponent } from './poll/poll.component';
import { VoteComponent } from './vote/vote.component';

const routes: Routes = [
  { path: '', redirectTo: '/poll', pathMatch: 'full' },
  { path: 'poll', component: PollComponent },
  { path: 'poll/new', component: PollEditComponent },
  { path: 'poll/register/:id', component: PollRegisterComponent },
  { path: 'poll/:id', component: VoteComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
