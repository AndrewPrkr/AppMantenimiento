import { Injectable } from '@angular/core';
import { map, Observable, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Servicedate {
  
    public currentTime$: Observable<Date> = timer(0, 1000).pipe(
    map(() => new Date()));
}
