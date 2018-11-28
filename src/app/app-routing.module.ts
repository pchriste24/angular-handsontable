import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HandsOnTableComponent } from '../components/hands-on-table/hands-on-table.component';

const routes: Routes = [
  { path: 'hot-table', component: HandsOnTableComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
