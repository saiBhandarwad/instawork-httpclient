import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../store.service';
import { PostComponent } from '../post/post.component';
import axios from 'axios';
import { LoaderComponent } from '../loader/loader.component';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-job',
  standalone: true,
  imports: [CommonModule, PostComponent, LoaderComponent],
  templateUrl: './job.component.html',
  styleUrl: './job.component.css'
})
export class JobComponent implements OnInit, OnChanges {
  token: string;
  showUpdateBox!: boolean;
  email: string;
  workToUpdate: any = {}
  @Input() action!: string;
  @Input() loading: boolean = true;
  @Input() jobArray!: Array<any>;
  @Output() deleteWorkEvent = new EventEmitter();
  @Output() updateWorkEvent = new EventEmitter();
  @Output() saveJobEvent = new EventEmitter();
  @Output() removeFromSavedEvent = new EventEmitter();
  noDataMsg!: string;
  
  
  constructor(private storeService: StoreService) {
    this.token = localStorage.getItem("auth-token") ?? "";
    this.email = jwtDecode<any>(this.token).email
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.noDataMsg = "NO DATA FOUND"
    console.log(changes);
    
  }
  ngOnInit(): void {
    console.log(this.jobArray);
    this.noDataMsg = "Loading..."
  }
  handleMore(show: boolean, i: number) {
    if (show) {
      (<HTMLInputElement>document.getElementById("moreContainer" + i)).style.display = "block"
    } else {
      (<HTMLInputElement>document.getElementById("moreContainer" + i)).style.display = "none"
    }
  }
  async removeFromSaved(work: object) {
      const response = await axios.post("https://instawork-backend.vercel.app/work/removeFromSavedJob", {
          data: { work, token : this.token },
          headers: { token : this.token }
      });
      this.removeFromSavedEvent.emit()
      this.loading = true
   }
  hideContainer(action:string){
    this.showUpdateBox = false
    this.workToUpdate = ""
    if(action==="update"){
      this.updateWorkEvent.emit()
    }
  }
  async deleteWork(work: any) {
    const result = confirm("do you want to delete?")
    if (result) {
      this.deleteWorkEvent.emit(work)
    }else{
      return
    }

  }
  updateWork(work: object) {
    this.showUpdateBox = true
    this.workToUpdate = work
  }
  
  debouncedSaveJob(){
    let timer:any;
    return (e:any,work:any) =>{
      console.log(e);
      e.target.style.cssText = "background-color :#5f7385; cursor:not-allowed"
      if(timer)clearTimeout(timer);
      timer = setTimeout(() => {
        this.handleSaveJob(work)
      }, 500);
    }
  }
  optSaveJob = this.debouncedSaveJob()
  async handleSaveJob(work: any) {
    // console.log(work,this.token);
    let workCopy = { ...work }
    if (workCopy.hasOwnProperty("status")) { delete workCopy.status }
    if (workCopy.hasOwnProperty("daysAgo")) { delete workCopy.daysAgo }
    if (workCopy.hasOwnProperty("more")) { delete workCopy.more }
    this.loading = true
    const res = await axios.post("https://instawork-backend.vercel.app/work/saveJob", {
      data: { work },
      headers: { token: this.token }
    });
    console.log({ res });
    this.saveJobEvent.emit()
    
  }
}
