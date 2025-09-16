import { Component, inject, Inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Servicedate } from './services/servicedate';
import { Logincomponent } from "./components/logincomponent/logincomponent";

@Component({
  selector: 'app-root',
  imports: [CommonModule, Logincomponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  }


 


