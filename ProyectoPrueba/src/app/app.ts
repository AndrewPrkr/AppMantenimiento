import { Component, inject, Inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Servicedate } from './services/servicedate';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  
    constructor(private fecha: Servicedate) {}
    
    date!: Observable<Date>;
  
    ngOnInit(){
     this.date = this.fecha.currentTime$; // ✅ observable directo
  }



  }


 


