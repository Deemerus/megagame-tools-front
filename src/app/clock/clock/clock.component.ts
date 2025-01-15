import { Component, OnDestroy } from '@angular/core';
import { ClockService } from '../clock-service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clock.component.html',
  styleUrl: '../clock.css'
})
export class ClockComponent implements OnDestroy{

  clockSub: Subscription = new Subscription();
  errorMessage = '';
  
  constructor(private clockService : ClockService, private router : Router) {
    this.errorMessage = clockService.getErrorMessage();
  }
  
  ngOnDestroy(): void {
    this.clockSub.unsubscribe();
  }

  createNewClock() : void {
    this.clockSub = this.clockService.getClockCreatedSub().subscribe(id => {
      this.router.navigate(['/clock/view/', id]);
    });
    this.clockService.createNewClock();
  }

  

}
