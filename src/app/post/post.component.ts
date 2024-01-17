import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StoreService } from '../store.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotifyComponent } from '../notify/notify.component';
import axios from 'axios';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [NotifyComponent, CommonModule, FormsModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit{
  showNotify: boolean;
  containerClass: string="post-container";
  workType: string = "";
  salary: string = "";
  salaryPeriod: string = "";
  city: string = "";
  duration: string = "";
  endDate: string = "";
  startDate: string = "";
  workDetails: string = "";
  address: string = "";
  token: string;
  @Input() workToUpdate:any;
  @Input() showUpdateBox!: boolean;
  @Output() hideContainerEvent = new EventEmitter();

  constructor(private storeService: StoreService) {
    this.token = localStorage.getItem('auth-token') ?? ""
    this.showNotify = this.storeService.showNotify 
  }
  ngOnInit(): void {
    console.log({workToUpdate:this.workToUpdate, showUpdateBox:this.showUpdateBox});
    if (this.workToUpdate) {
      this.containerClass = "updateBoxContainer"
      this.workType = this.workToUpdate.type
      this.salary = this.workToUpdate.salary
      this.salaryPeriod = this.workToUpdate.salaryPeriod
      this.city = this.workToUpdate.city
      this.duration = this.workToUpdate.duration
      this.endDate = this.workToUpdate.endDate.slice(0, 10)
      this.startDate = this.workToUpdate.startDate.slice(0, 10)
      this.workDetails = this.workToUpdate.detail
      this.address = this.workToUpdate.address
      if (this.workToUpdate.salaryPeriod === "daily") {
        document.getElementById("daily")?.classList.add("active")
        document.getElementById("weekly")?.classList.remove("active")
      } else {
        document.getElementById("weekly")?.classList.add("active")
        document.getElementById("daily")?.classList.remove("active")
      }
    }   
    
  }

  stopPropogation(e: any) {
    e.stopPropagation()
  }
  handleContainer() {
    if(this.workToUpdate){
      this.hideContainerEvent.emit("hide")
    }
  }
  handleActive(e: any) {
    if (e.target.id === "daily") {
      document.getElementById("daily")?.classList.add("active")
      document.getElementById("weekly")?.classList.remove("active")
    } else {
      document.getElementById("weekly")?.classList.add("active")
      document.getElementById("daily")?.classList.remove("active")
    }
    this.salaryPeriod = e.target.id
  }
  async handlePost(action: string) {
    if (!this.workType) {
      document.getElementById("workType")?.focus()
      document.getElementById("workType")?.classList.add("error-field")
      return
    } else {
      document.getElementById("workType")?.classList.remove("error-field")
    }
    if (!this.salary) {
      document.getElementById("salary")?.focus()
      document.getElementById("salary")?.classList.add("error-field")
      return
    } else {
      document.getElementById("salary")?.classList.remove("error-field")
    }
    if (!this.city) {
      document.getElementById("city")?.focus()
      document.getElementById("city")?.classList.add("error-field")
      return
    } else {
      document.getElementById("city")?.classList.remove("error-field")
    }
    if (!this.duration) {
      document.getElementById("duration")?.focus()
      document.getElementById("duration")?.classList.add("error-field")
      return
    } else {
      document.getElementById("duration")?.classList.remove("error-field")
    }
    if (!this.startDate) {
      document.getElementById("startDate")?.focus()
      document.getElementById("startDate")?.classList.add("error-field")
      return
    } else {
      document.getElementById("startDate")?.classList.remove("error-field")
    }
    if (!this.endDate) {
      document.getElementById("endDate")?.focus()
      document.getElementById("endDate")?.classList.add("error-field")
      return
    } else {
      document.getElementById("endDate")?.classList.remove("error-field")
    }
    if (!this.workDetails) {
      document.getElementById("workDetails")?.focus()
      document.getElementById("workDetails")?.classList.add("error-field")
      return
    } else {
      document.getElementById("workDetails")?.classList.remove("error-field")
    }
    if (!this.address) {
      document.getElementById("address")?.focus()
      document.getElementById("address")?.classList.add("error-field")
      return
    } else {
      document.getElementById("address")?.classList.remove("error-field")
    }
    if (!this.salaryPeriod) {
      document.getElementById("daily")?.focus()
      document.getElementById("daily")?.classList.add("error-field")
      return
    } else {
      document.getElementById("daily")?.classList.remove("error-field")
    }
    let res;
    if (action === "update") {
      res = await axios.patch("https://instawork-backend.vercel.app/work/updateWork", {
        data: {
          workType: this.workType.charAt(0).toUpperCase()+this.workType.slice(1), salary: this.salary, city: this.city.charAt(0).toUpperCase()+this.city.slice(1), duration: this.duration, startDate: this.startDate, endDate: this.endDate, detail: this.workDetails, address: this.address, salaryPeriod: this.salaryPeriod, _id: this.workToUpdate._id
        },
        headers: {
          token: this.token
        }
      })
      this.hideContainerEvent.emit("update")
    }
    if (action === "post") {
      res = await axios.post("https://instawork-backend.vercel.app/work/postJob", {
        data: {
          workType: this.workType.charAt(0).toUpperCase()+this.workType.slice(1), salary: this.salary, city: this.city.charAt(0).toUpperCase()+this.city.slice(1), duration: this.duration, startDate: this.startDate, endDate: this.endDate, detail: this.workDetails, address: this.address, salaryPeriod: this.salaryPeriod, postedDate: Date.now()
        },
        headers: {
          token: this.token
        }
      })
    }
    if (res?.data.success) {
      this.workType = "", this.salary = "", this.city = "", this.duration = "", this.startDate = "", this.endDate = "", this.workDetails = "", this.address = "", this.salaryPeriod = ""
      document.getElementById("weekly")?.classList.remove("active")
      document.getElementById("daily")?.classList.remove("active")
    }
    console.log({ res });
    this.storeService.getAllWorks()
  }

}
