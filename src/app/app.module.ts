import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { HttpClientModule } from '@angular/common/http';
import { TestComponent } from './testfolder/test/test.component';
import { ProdComponent } from './testfolder/prod/prod.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    TestComponent,
    ProdComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
