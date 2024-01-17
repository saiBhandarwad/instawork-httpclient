import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { JobComponent } from '../job/job.component';
import { StoreService } from '../store.service';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-myjob',
  standalone: true,
  imports: [JobComponent],
  templateUrl: './myjob.component.html',
  styleUrl: './myjob.component.css'
})
export class MyjobComponent implements OnInit, OnChanges {
  allWorks: Array<any> = [];
  savedJobs: Array<any> = [];
  myJobs: Array<any> = [];
  action: string = "";
  token: string = "";
  loading: boolean = false;
  getSavedJobs;
  showMyJobs: boolean = true;
  getMyJobs: (token: string) => void;

  constructor(private storeService: StoreService, private apiService: ApiService) {
    this.token = localStorage.getItem("auth-token") ?? ""
    this.getSavedJobs = this.storeService.importGetSavedJobs()
    this.getMyJobs = this.storeService.importGetMyJobs()
    this.getSavedJobs(this.token)
    this.getMyJobs(this.token)
    this.showMyJobs = false

  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log({ changes });

  }
  ngOnInit(): void {
    console.log({ savedJobs: this.savedJobs });
    console.log({ myJobs: this.myJobs });
    setTimeout(() => {
      this.handleMyJobs()
    }, 1000);
  }
  handleMyJobs() {
    document.getElementById("bg_btn")?.classList.add("left")
    document.getElementById("bg_btn")?.classList.remove("right")
    this.showMyJobs = true
    this.allWorks = this.myJobs
    this.action = ""
  }
  handleMySavedJobs() {
    document.getElementById("bg_btn")?.classList.add("right")
    document.getElementById("bg_btn")?.classList.remove("left")
    this.showMyJobs = false
    this.allWorks = this.savedJobs
    this.action = "remove"
  }
  handleRemoveFromSaved() {
    this.getSavedJobs(this.token)
    this.getMyJobs(this.token)
    if (this.loading) {
      this.loading = false
      setTimeout(() => {
        this.allWorks = this.savedJobs
      }, 1000);
    } else {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 1000);
      setTimeout(() => {
        this.allWorks = this.savedJobs
      }, 1000);
    }
  }
  handleSaveJob() {
    if (this.loading) {
      this.loading = false
    } else {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 1000);
      setTimeout(() => {
        this.allWorks = this.myJobs
      }, 1000);
      this.getSavedJobs(this.token)
      this.getMyJobs(this.token)
    }

  }
}
