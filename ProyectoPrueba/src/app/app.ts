import { Component, inject, Inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { LoginComponent } from './components/logincomponent/logincomponent';


@Component({
  selector: 'app-root',
  imports: [CommonModule, LoginComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
    title = 'Transport Maintenance App';

  }


 


