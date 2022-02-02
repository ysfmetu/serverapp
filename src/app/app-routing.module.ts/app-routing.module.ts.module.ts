import { AuthGuard } from './../guards/auth.guard';
import { AnasayfaComponent } from './../anasayfa/anasayfa.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from '../guards/login.guard';
import { LoginComponent } from '../login/login.component';
import { CategoryComponent } from '../category/category.component';
import { UpdateServerComponent } from '../components/update-server/update-server.component';

const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'kategori', component: CategoryComponent, canActivate: [AuthGuard] },
  { path: 'anasayfa/:id', component: AnasayfaComponent },
  { path: 'update-server/:id',component:UpdateServerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
