import { ServerRequestModule } from './server-request/server-request.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { NotificationModule } from './notification.module';
import { LoginComponent } from './login/login.component';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module.ts/app-routing.module.ts.module';
import { AnasayfaComponent } from './anasayfa/anasayfa.component';
import { CategoryComponent } from './category/category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdateServerComponent } from './components/update-server/update-server.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AnasayfaComponent,
    CategoryComponent,
    UpdateServerComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    NotificationModule,
    ServerRequestModule,
    FormsModule,
    ReactiveFormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
