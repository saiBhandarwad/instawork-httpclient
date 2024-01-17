import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient) { }
  login(email:string,password:string):any{
    return this.http.post("https://instawork-backend.vercel.app/user/login",{data:{email,password}})
  }
  sendOTP(phone:string):any{
    return this.http.post("https://instawork-backend.vercel.app/sendOTP",{data:{phone}})
  }
  fetchAllWorks(token: string){    
    return this.http.post("https://instawork-backend.vercel.app/work/works",{
      headers: { token }
    })
  }
  fetchSavedJobs(token: string){
    let email;
    if (token) {
      email = jwtDecode<any>(token).email
    }
    return this.http.post("https://instawork-backend.vercel.app/work/getSavedJobs",{
      data: { email },
      headers: { token }
    })
  }
  fetchMyJobs(token:string){
    let email;
    if (token) {
      email = jwtDecode<any>(token).email
    }
    return this.http.post("https://instawork-backend.vercel.app/work/getMyJobs",{
      data: { email },
      headers: { token }
    })
  }
  validateUser(token: string){
    return this.http.post("https://instawork-backend.vercel.app/user/validateUser",{
      data: { token }
    })
  }
  fetchAllCityAndWorks(token:string){
    return this.http.post("https://instawork-backend.vercel.app/work/getAllCityAndWorks",{
      headers: { token }
    })
  }
  fetchFilteredWorks(token:string,obj:Object,sortBy:string,sortType:string,pathname?:string,email?:string){
    return this.http.post("https://instawork-backend.vercel.app/work/getWorksByFilter",{
      data: { filterOBJECT: obj, sortBy, type: sortType, pathname, email },
      headers: { token }
    })
  }
  
}
