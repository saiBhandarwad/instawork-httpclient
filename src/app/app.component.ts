import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { StoreService } from './store.service';
import { NavbarComponent } from './navbar/navbar.component';
import { ApiService } from './api.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers:[StoreService]
})
export class AppComponent implements OnInit{
  // isLoggedIn!: boolean;
  token!:string;
  user!:Object;
  isUserValid!:boolean;
  validateUser;
  constructor(private apiService:ApiService, private storeService:StoreService){
    this.token = localStorage.getItem("auth-token") ?? ""
    this.validateUser = this.storeService.importValidateUser()
    this.validateUser()
    console.log({user:this.user,isUserValid:this.isUserValid});
  }
  ngOnInit(): void {}
  handleNavbar(res:any){
    const {action} = res
    if(action==="login"){
      this.validateUser(res.token)
      this.isUserValid = true
    }
    if(action==="logout"){
      this.isUserValid = false
    }
  }
  handleNavbarEvent(componentRef:any){
    componentRef?.navbarEvent?.subscribe((res:any)=>{
      this.handleNavbar(res)
    })
  }
}
