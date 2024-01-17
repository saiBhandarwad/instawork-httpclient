import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NotifyComponent } from '../notify/notify.component';
import { StoreService } from '../store.service';
import { JobComponent } from '../job/job.component';
import { FilterComponent } from '../filter/filter.component';
import { ApiService } from '../api.service';
import axios from 'axios';

@Component({
  selector: 'app-works',
  standalone: true,
  imports: [CommonModule, NotifyComponent, JobComponent, FilterComponent],
  templateUrl: './works.component.html',
  styleUrl: './works.component.css'
})
export class WorksComponent{
  showNotify: boolean;
  allWorks: Array<any> = [];
  token: string;
  email: string;
  loading!: boolean;
  getAllWorks;
  getWorksByFilter: (token: string, obj: Object, sortBy: string, sortType: string, pathname?: string | undefined, email?: string | undefined) => void;
  isWorkUpdated!: boolean;

  constructor(private storeService: StoreService, private apiService: ApiService) {
    setTimeout(() => {
      this.showNotify = false
    }, 5000);
    this.showNotify = this.storeService.showNotify
    this.email = this.storeService.email
    this.token = localStorage.getItem("auth-token") ?? ""
    this.getAllWorks = this.storeService.importGetAllWorks()
    this.getWorksByFilter = this.storeService.importGetWorksByFilter()
    this.getAllWorks()
  }
  async deleteWork(work: any) {
    this.storeService.loading = true
    const res = await axios.post("https://instawork-backend.vercel.app/work/deleteWork", {
      data: { work },
      headers: { token: this.token }
    });
    this.isWorkUpdated = !this.isWorkUpdated
    this.storeService.loading = false
    this.loading = true
    this.getAllWorks()
  }
  handleLoading(event:any){   
    this.loading = true
  }
  handleSaveJob(){
    console.log("handleSaveJob");    
    this.getAllWorks()
  }
  handleUpdateWorkEvent(){
    this.isWorkUpdated = !this.isWorkUpdated
    this.loading = true
    this.getAllWorks()
  }
  handleFilterWorks(obj:any){
    const {sortType,sortBy} = obj
    if(obj.salaryPeriod === "any"){
      console.log(obj.salaryPeriod);
      delete obj.salaryPeriod
    }
    delete obj.sortBy
    delete obj.sortType 
    this.getWorksByFilter(this.token,obj,sortBy,sortType)
  }
}
