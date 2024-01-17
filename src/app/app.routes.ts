import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { WorksComponent } from './works/works.component';
import { PostComponent } from './post/post.component';
import { MyjobComponent } from './myjob/myjob.component';

export const routes: Routes = [
    {path:"",component:HomeComponent},
    {path:"works",component:WorksComponent},
    {path:"post",component:PostComponent},
    {path:"login",component:LoginComponent},
    {path:"signup",component:SignupComponent},
    {path:"myjobs",component:MyjobComponent},
];
