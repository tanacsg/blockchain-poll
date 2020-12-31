import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PollComponent } from './poll/poll.component';

const routes: Routes = [
  { path: '', redirectTo: '/poll', pathMatch: 'full' },
  { path: 'poll', component: PollComponent },
  { path: 'poll/:id', component: PollComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
