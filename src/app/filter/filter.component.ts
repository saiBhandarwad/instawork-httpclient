import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoreService } from '../store.service';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent implements OnChanges{
  @Output() loadingEvent = new EventEmitter();
  token:string;
  showWorkOptions:boolean=false
  showLocationOptions:boolean=false
  salary:number=500;
  cityValue:string=""
  workTypeValue:string=""
  sortType: string = "asc";
  sortBy: string= "postedDate";
  salaryPeriod: string="any";
  cityArray!: Array<any>;
  workTypeArray!:Array<any>;
  copyOfCityArray!: Array<any>;
  copyOfWorkTypeArray!:Array<any>;
  getAllCityAndWorks: (token?: string) => void;
  @Output() filterEvent = new EventEmitter
  @Input() isWorkUpdated!:boolean;

  constructor(private storeService:StoreService, private apiService:ApiService){
    this.token = localStorage.getItem("auth-token") ?? ""
    this.getAllCityAndWorks = this.storeService.importGetAllCityAndWorks()
    this.getAllCityAndWorks()
    console.log({isWorkUpdated:this.isWorkUpdated});
    
  }
  ngOnChanges(changes: SimpleChanges): void { 
    if(changes['isWorkUpdated'].currentValue !== changes['isWorkUpdated'].previousValue){
      this.getAllCityAndWorks()
    }
  }
  
  handleWorkType(bool:boolean){
    this.showWorkOptions = bool
    if(bool===false && this.workTypeValue.length!==0){
      this.workTypeArray = this.copyOfWorkTypeArray.filter((elem:any)=>{
        return elem.startsWith(this.workTypeValue)
      })
    }
  }
  handleLocation(bool:boolean){
    this.showLocationOptions = bool
    if(bool===false && this.cityValue.length!==0){
      this.cityArray = this.copyOfCityArray.filter((elem:any)=>{
        return elem.startsWith(this.cityValue)
      })
    }
  }
  handleSalary(e:any){
    if(+e.target.value === 0.5){
      this.salary = 500
    }else{
      this.salary = Math.round(e.target.value-1)*1000
    }
    this.loadingEvent.emit(true)
    this.filterEvent.emit(this.getObj())
    
  }
  handleWorkOption(e:any,elem:any){
    this.workTypeValue = elem
    this.loadingEvent.emit(true)
    this.filterEvent.emit(this.getObj())
    
  }
  handleCityOption(e:any,elem:any){   
    this.cityValue = elem
    this.loadingEvent.emit(true)
    this.filterEvent.emit(this.getObj())
    
  }
  getObj(){
    let obj:any = {salary: { $gte: this.salary }, salaryPeriod:this.salaryPeriod, sortBy:this.sortBy, sortType:this.sortType}

    if(this.workTypeValue){
      obj.type = this.workTypeValue
    }
    if(this.cityValue){
      obj.city = this.cityValue
    }
    return obj
  }
  stopPropogation(e:any){
    console.log(e);    
  }
  handleWorkTypeArray(e:any){
    if(this.workTypeValue.length===0){
      this.loadingEvent.emit(true)
      this.filterEvent.emit(this.getObj())
    }
    this.workTypeArray = this.copyOfWorkTypeArray.filter((elem:any)=>{
      return elem.startsWith(e.target.value.charAt(0).toUpperCase()+e.target.value.slice(1))
    })
  }
  handleCityArray(e:any){
    if(this.cityValue.length===0){
      this.loadingEvent.emit(true)
      this.filterEvent.emit(this.getObj())
    }
    this.cityArray = this.copyOfCityArray.filter((elem:any)=>{
      return elem.startsWith(e.target.value.charAt(0).toUpperCase()+e.target.value.slice(1))
    })
  }
  handleSalaryPeriod(period:string){
    this.salaryPeriod = period
    this.loadingEvent.emit(true)
    this.filterEvent.emit(this.getObj())
    
  }
  handleSortType(e:any){
    let id = e.target.id
    this.sortType = id
    if(id === "asc"){
      document.getElementById("asc")?.classList.add("active")
      document.getElementById("desc")?.classList.remove("active")
    }else{
      document.getElementById("desc")?.classList.add("active")
      document.getElementById("asc")?.classList.remove("active")
    }
    this.loadingEvent.emit(true)
    this.filterEvent.emit(this.getObj())
    
  }
  handleSortBy(sortBy:string){
    this.sortBy = sortBy
    this.loadingEvent.emit(true)
    this.filterEvent.emit(this.getObj())
    
  }
  handleReset(e:any){
    console.log(this.workTypeValue,this.cityValue,this.salary,this.salaryPeriod,this.sortBy,this.sortType);
    
  }
}
