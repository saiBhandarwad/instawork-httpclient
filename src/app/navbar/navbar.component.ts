import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from '../store.service';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  @Input() isUserValid!:boolean; 
  @Input() user!:any; 
  @Output() navbarEvent = new EventEmitter();
  showMenu:boolean = true
  validateUser;
  token:string;
  
  constructor(private router:Router,private apiService:ApiService, private storeService:StoreService){
    this.token = localStorage.getItem("auth-token") ?? ""
    this.validateUser = this.storeService.importValidateUser()
    this.validateUser()
    
  }
  ngOnInit(): void {
    console.log({user:this.user});
    
  }
  handleLink(path:string){
    this.navigate(path)
    if(path === "login"){
     (<HTMLInputElement>document.getElementById("signup"))?.classList.remove("activeLink");
     (<HTMLInputElement>document.getElementById("home"))?.classList.remove("activeLink");
     (<HTMLInputElement>document.getElementById(path))?.classList.add("activeLink")
    }
    else if(path === "signup"){
      (<HTMLInputElement>document.getElementById("login"))?.classList.remove("activeLink");
      (<HTMLInputElement>document.getElementById("home"))?.classList.remove("activeLink");
      (<HTMLInputElement>document.getElementById(path))?.classList.add("activeLink")
    }
    else{
      (<HTMLInputElement>document.getElementById("signup"))?.classList.remove("activeLink");
      (<HTMLInputElement>document.getElementById("login"))?.classList.remove("activeLink");
      (<HTMLInputElement>document.getElementById("home"))?.classList.add("activeLink")
    }
    
  }
  navigate(path:string){
    this.router.navigate([path])
  }
  handleLogout(){    
    localStorage.removeItem("auth-token")
    // this.navbarEvent.emit("logout")
    this.validateUser("")
    this.storeService.showNotify = true
    this.storeService.notify = {status:true, message:"logout successfully"}
    this.router.navigate(["/login"])
  }
  handleBar(){

  }
  handleClose(){

  }
  handleHome(){
    
  }
  handleLogin(){
    
  }
  handleSignup(){

  }

}
