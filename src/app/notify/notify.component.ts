import { Component } from '@angular/core';
import { StoreService } from '../store.service';

@Component({
  selector: 'app-notify',
  standalone: true,
  imports: [],
  templateUrl: './notify.component.html',
  styleUrl: './notify.component.css'
})
export class NotifyComponent {
  constructor(private storeService:StoreService){}
  notify:any = this.storeService.notify
  message:string = this.notify.message
}
