import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Servicedate } from '../../services/servicedate';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logincomponent',
  imports: [CommonModule],
  templateUrl: './logincomponent.html',
  styleUrl: './logincomponent.css'
})
export class Logincomponent {
     constructor(private fecha: Servicedate) {}
    
    date!: Observable<Date>;
  
    ngOnInit(){
     this.date = this.fecha.currentTime$; // ✅ observable directo
  }


}
