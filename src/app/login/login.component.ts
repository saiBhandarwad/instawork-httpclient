import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import axios from 'axios';
import { StoreService } from '../store.service';
import { NotifyComponent } from '../notify/notify.component';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, NotifyComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  @Output() navbarEvent = new EventEmitter();
  showNotify: boolean = this.storeService.showNotify
  showOTP: boolean = false
  OTPSent: boolean = false
  invalidNumber: boolean = false
  resOTP: Number = 0
  otpVerified: boolean = true
  email: string = ""
  password: string = ""
  mobileNumber: any;
  constructor(private router: Router, private storeService: StoreService, private apiService: ApiService) {
    setTimeout(() => {
      this.showNotify = false
    }, 5000);
  }

  optLogin = this.debouncedLogin()
  async handleLogin() {    
    if (this.email.length < 3 || !this.email) {
      (<HTMLInputElement>document.getElementById("login_email")).classList.add("error_field")
      return
    } else {
      (<HTMLInputElement>document.getElementById("login_email")).classList.remove("error_field")
    }
    if (this.password.length < 6 || !this.password) {
      (<HTMLInputElement>document.getElementById("login_password")).classList.add("error_field")
      return
    } else {
      (<HTMLInputElement>document.getElementById("login_password")).classList.remove("error_field")
    }
    if (this.email && this.password) {
      console.log("handlelogin");
      this.apiService.login(this.email, this.password).subscribe((res: any) => {
        console.log({ res });
        this.storeService.notify = { status: res.success, message: res.message }
        this.storeService.showNotify = true
        if (res.success) {
          this.storeService.isLoggedIn = true
          this.navbarEvent.emit({...res,action:"login"})
          this.router.navigate(["works"])          
          if (res.token) {
            localStorage.setItem("auth-token", res.token)
          }
        } else {
          console.warn("login failed!");
          this.storeService.notify = { status: res.success, message: res.message }
          this.showNotify = true
          setTimeout(() => {
            this.showNotify = false
          }, 5000);
          this.storeService.isLoggedIn = false
        }
      })
    }
  }
  debouncedLogin() {
    let timer: any;
    console.log("1");
    return () => {
      console.log("2");
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        this.handleLogin()
      }, 500);
    }
  }
  navigate(path: string) {
    this.router.navigate([path])
  }
  handleMobileNumber(e: any) {
    if (e.target.value.length === 10 || e.target.value.length === 0) {
      (<HTMLInputElement>document.getElementById(e.target.id)).classList.remove("error_field")
    } else {
      (<HTMLInputElement>document.getElementById(e.target.id)).classList.add("error_field")
    }
  }
  optSendOTP = this.debouncedSendOTP()
  debouncedSendOTP() {
    let timer: any;
    return () => {
      if (this.mobileNumber?.toString().length !== 10 || this.mobileNumber === undefined) {
        (<HTMLInputElement>document.getElementById("mobile_number")).classList.add("error_field")
        return
      }
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        this.sendOTP()
      }, 500);
    }
  }
  async sendOTP() {

    if (this.mobileNumber?.toString().length === 10) {

      this.showOTP = true
      this.apiService.sendOTP(this.mobileNumber).subscribe((res: any) => {
        if(res.success){
          this.OTPSent = true
          this.invalidNumber = false
          this.resOTP = res.OTP
        } else if (res.success === false) {
          this.invalidNumber = true
        }
      })
    }
  }
  BindVerifyOTP = this.verifyOTP.bind(this)
  async verifyOTP() {
    const otp1 = (<HTMLInputElement>document.getElementById("login_otp1")).value
    const otp2 = (<HTMLInputElement>document.getElementById("login_otp2")).value
    const otp3 = (<HTMLInputElement>document.getElementById("login_otp3")).value
    const otp4 = (<HTMLInputElement>document.getElementById("login_otp4")).value
    let totalOTP = otp1 + otp2 + otp3 + otp4

    if (+totalOTP === this.resOTP) {
      this.otpVerified = true
      this.showOTP = false
      const res = await axios.post("https://instawork-backend.vercel.app/user/loginWithOTP", {
        data: {
          phone: this.mobileNumber
        }
      })

      this.storeService.showNotify = true
      this.storeService.notify = { status: res.data.success, message: res.data.message }
      if (res.data.token) {
        this.storeService.isLoggedIn = true
        localStorage.setItem("auth-token", res.data.token)
        this.router.navigate(["works"])
      }
    } else {
      this.otpVerified = false
      this.OTPSent = false
    }
  }
  handleOTP(e: any, focusElem: string, fn: any = null) {
    if (e.target.value.length > 0) {
      (<HTMLInputElement>document.getElementById(e.target.id)).value = e.target.value.slice(e.target.value.length - 1)
      if (focusElem && e.code !== "Backspace") {
        (<HTMLInputElement>document.getElementById(focusElem)).focus()
      }
      if (fn && e.code !== "Backspace") {
        fn()
      }
    }
  }
  handleBackSpace(e: any, focusElem: string) {
    (<HTMLInputElement>document.getElementById(focusElem)).focus();
    (<HTMLInputElement>document.getElementById(focusElem)).value = ""
  }
}
