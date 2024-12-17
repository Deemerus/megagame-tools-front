import { Component, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { ClockService } from '../clock-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Clock } from '../clock-model';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-clock-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clock-view.component.html',
  styleUrl: '../clock.css'
})
export class ClockViewComponent implements OnDestroy {
  clockSub: Subscription = new Subscription();
  clock!: Clock;
  interval: any;

  constructor(private clockService: ClockService, private activatedRoute: ActivatedRoute, private router: Router, @Inject(PLATFORM_ID) platformId: object) {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) {
      id = '';
    }
    this.clockSub = this.clockService.getClockSub().subscribe(clock => {
      this.clock = clock;
      if (this.clock.timeRemaining > 0) {
        clearInterval(this.interval);
        this.startInterval(platformId);
      }
    });
    this.clockService.getClock(id);
  }

  ngOnDestroy(): void {
    this.clockSub.unsubscribe();
    clearInterval(this.interval);
  }

  startInterval(platformId: object) {
    if (isPlatformBrowser(platformId)) {
      this.interval = setInterval(() => {
        this.clock.timeRemaining -= 1;
        if (this.clock.timeRemaining <= 0) {
          clearInterval(this.interval);
        }
      }, 1000);
    }
  }

  editClock() {
    this.router.navigate(['/clock/setup/', this.clock.id]);
  }

  startClock() {
    this.clockService.startClock(this.clock.id);
  }

  getGameUrl(gameName: string) {
    return '/clock/timer/' + this.clock.id + '/' + gameName;
  }

  showTime(time: number) {
    if (time < 0) {
        return '0:00';
    }
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    if (seconds < 10) {
        return minutes + ':0' + seconds;
    }
    return minutes + ':' + seconds;
  }

  getPhaseStart(gameName : string, phaseIndex: number) {
    if(phaseIndex == 0) {
      return 0;
    }
    return this.clock.games.find(game => game.name === gameName)?.phases[phaseIndex - 1].end;
  }
}
