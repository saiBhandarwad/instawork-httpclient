import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  emailVerified:boolean=false
  showEmailOTP:boolean=false
  OTPSent:boolean=true
  otpVerified:boolean=true
  mobileNumberVerified:boolean=false
  showMobileOTP:boolean=false
  mobileOTPSent:boolean=true
  isMobileValid:boolean=true
  mobileOTPVerified:boolean=true

  handleFirstName(){}
  handleLastName(){}
  handleEmail(){}
  handleVerifyEmail(){}
  verifyOTP(){}
  handleOTP(elem:string, fn:any=null){}
  handleBackSpace(elem:string){}
  handlePassword(){}
  handleConfirmPassword(){}
  handleMobileNum(){}
  sendMobileOTP(){}
  verifyMobileOTP(){}
  handleMobileOTP(elem:string, fn:any=null){}
  navigate(path:string){}
  handleSignup(){}
}
