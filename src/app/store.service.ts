import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { ApiService } from './api.service';
@Injectable({
  providedIn: 'root'
})
export class StoreService {
  httpClient = inject(HttpClient)
  token: string;
  user: any = {}
  isUserValid: boolean = false
  isLoggedIn: boolean = false
  loading: boolean = false
  showNotify: boolean = false
  showContainer: boolean = false
  showUpdateBox: boolean = false
  workToUpdate: Object = {}
  email: string = ""
  notify: Object = { status: "", message: "" }
  allWorks: any;
  savedJobs: Array<Object> = []
  myJobs: Array<Object> = []
  workTypeArray: Array<Object> = []
  cityArray: Array<Object> = []
  copyOfCityArray: any;
  copyOfWorkTypeArray: any;

  constructor(private apiService: ApiService) {
    this.token = localStorage.getItem("auth-token") ?? ""
    this.getMyJobs(this.token)
    this.getSavedJobs(this.token)
    this.getAllWorks(this.token)
    this.getAllCityAndWorks(this.token)
    this.validateUser(this.token)
    if (this.token) {
      this.email = jwtDecode<any>(this.token).email
    }
  }
  /******************* getAllCityAndWorks *********************** */
  importGetAllCityAndWorks() {
    return this.getAllCityAndWorks
  }
  getAllCityAndWorks(token: string = this.token) {
    // const res = await axios.post("https://instawork-backend.vercel.app/work/getAllCityAndWorks", {
    //   headers: { token }
    // });
    this.apiService.fetchAllCityAndWorks(token).subscribe((res: any) => {
      // console.log({ res });
      this.workTypeArray = res.workTypeArray
      this.cityArray = res.cityArray
      this.copyOfCityArray = res.cityArray
      this.copyOfWorkTypeArray = res.workTypeArray
    })
  }

  /******************* getAllWorks *********************** */
  importGetAllWorks() {
    return this.getAllWorks
  }
  getAllWorks(token: string = this.token) {
    let email;
    if (token) {
      email = jwtDecode<any>(token).email
    }
    this.apiService.fetchAllWorks(token).subscribe((resWorks: any) => {
      // console.log({ token });
      this.apiService.fetchSavedJobs(this.token).subscribe((resSavedWorks: any) => {
        // console.log({ resSavedWorks });
        if (resWorks.success) {
          let works = resWorks.works
          let savedWorks = resSavedWorks.savedJobs

          this.allWorks = works?.map((work: {
            more: Array<any>; owner: string; daysAgo: any; postedDate: any; _id: any; status: string;
          }) => {
            let hours = Math.round((Date.now() - work.postedDate) / (1000 * 60 * 60))
            let minutes = Math.round(((Date.now() - work.postedDate) / (1000 * 60)))

            work.more = []
            if (this.email === work.owner) {
              work.more.push("create")
              work.more.push("update")
            }
            if (minutes < 59) {
              work.daysAgo = minutes + " minutes ago"
            } else if (hours >= 1 && hours < 24) {
              work.daysAgo = hours + " hours ago"
            } else {
              work.daysAgo = Math.round(hours / 24) + " days ago"
            }
            savedWorks?.map((savedWork: { user: string; id: any; }) => {
              if (work._id === savedWork.id) {
                work.status = "saved"
              }
              if (this.email === savedWork.user) {
                work.more.push("unsave")
              } else {
                work.more.push("save")
              }
            })
            return work
          })
        } else {
          this.notify = resWorks.message
          this.showNotify = true
        }
        this.loading = false
      })
    })
  }
  /********************* getSavedJobs **********************/
  importGetSavedJobs() {
    return this.getSavedJobs
  }
  getSavedJobs(token: string) {
    let email;
    if (token) {
      email = jwtDecode<any>(token).email
    }
    this.apiService.fetchSavedJobs(this.token).subscribe((res: any) => {
      console.log({ fetchSavedJobsRes: res });
      this.savedJobs = res.savedJobs?.map((work: {
        daysAgo: string; postedDate: number; status: string;
      }) => {
        let hours = Math.round((Date.now() - work.postedDate) / (1000 * 60 * 60))
        let minutes = Math.round(((Date.now() - work.postedDate) / (1000 * 60)))
        if (minutes < 59) {
          work.daysAgo = minutes + " minutes ago"
        } else if (hours >= 1 && hours < 24) {
          work.daysAgo = hours + " hours ago"
        } else {
          work.daysAgo = Math.round(hours / 24) + " days ago"
        }
        work.status = "saved"
        return work
      })
    })
    console.log({ savedJobs: this.savedJobs });

  }
  /************************** getMyJobs *****************************/
  importGetMyJobs() {
    return this.getMyJobs
  }
  getMyJobs(token: string) {
    let email;
    if (token) {
      email = jwtDecode<any>(token).email
    }
    this.apiService.fetchMyJobs(token).subscribe((resMyJobs: any) => {
      let myJobs = resMyJobs.myJobs
      this.apiService.fetchSavedJobs(token).subscribe((resSavedWorks: any) => {
        let savedWorks = resSavedWorks.savedJobs

        this.myJobs = myJobs?.map((work: { daysAgo: string; postedDate: number; _id: any; status: string; }) => {
          let hours = Math.round((Date.now() - work.postedDate) / (1000 * 60 * 60))
          let minutes = Math.round(((Date.now() - work.postedDate) / (1000 * 60)))
          if (minutes < 59) {
            work.daysAgo = minutes + " minutes ago"
          } else if (hours >= 1 && hours < 24) {
            work.daysAgo = hours + " hours ago"
          } else {
            work.daysAgo = Math.round(hours / 24) + " days ago"
          }
          savedWorks?.map((savedWork: { id: any; }) => {
            if (work._id === savedWork.id) {
              work.status = "saved"
            }
          })
          return work
        })
      })
    })
    console.log({ myJobs: this.myJobs });
  }
  /******************** validate user *********************************/
  importValidateUser() {
    return this.validateUser
  }
  validateUser(token: string = this.token) {
    this.apiService.validateUser(token).subscribe((res: any) => {
      if (res.success) {
        this.user = res.user
        this.isUserValid = true
      } else {
        this.isUserValid = false
      }
    })

  }
  /******************** getWorksByFilter *********************************/
  importGetWorksByFilter() {
    return this.getWorksByFilter
  }
  getWorksByFilter(token: string, obj: Object, sortBy: string, sortType: string, pathname?: string, email?: string) {
    this.apiService.fetchFilteredWorks(token, obj, sortBy, sortType, pathname, email).subscribe((resWorks: any) => {
      /****************************** editing works ******************** */
      this.apiService.fetchSavedJobs(this.token).subscribe((resSavedWorks: any) => {
        // console.log({ resSavedWorks });
        if (resWorks.success) {
          let works = resWorks.works
          let savedWorks = resSavedWorks.savedJobs

          this.allWorks = works?.map((work: {
            more: Array<any>; owner: string; daysAgo: any; postedDate: any; _id: any; status: string;
          }) => {
            let hours = Math.round((Date.now() - work.postedDate) / (1000 * 60 * 60))
            let minutes = Math.round(((Date.now() - work.postedDate) / (1000 * 60)))

            work.more = []
            if (this.email === work.owner) {
              work.more.push("create")
              work.more.push("update")
            }
            if (minutes < 59) {
              work.daysAgo = minutes + " minutes ago"
            } else if (hours >= 1 && hours < 24) {
              work.daysAgo = hours + " hours ago"
            } else {
              work.daysAgo = Math.round(hours / 24) + " days ago"
            }
            savedWorks?.map((savedWork: { user: string; id: any; }) => {
              if (work._id === savedWork.id) {
                work.status = "saved"
              }
              if (this.email === savedWork.user) {
                work.more.push("unsave")
              } else {
                work.more.push("save")
              }
            })
            return work
          })
        } else {
          this.notify = resWorks.message
          this.showNotify = true
        }
        this.loading = false
      })
    })
  }
  /******************** edit allworks *********************************/

}