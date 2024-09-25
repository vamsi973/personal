import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestComponent } from './testfolder/test/test.component';
import { ProdComponent } from './testfolder/prod/prod.component';

const routes: Routes = [
  // { path: 'aupris/test', component: "TestComponent" }
  // { path: 'aupris/prod', component: "ProdComponent" }
  {
    path: 'test', component: TestComponent
  },
  {
    path: 'prod', component: ProdComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
