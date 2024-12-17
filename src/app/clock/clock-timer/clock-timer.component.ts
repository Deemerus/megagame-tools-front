import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Subscription } from 'rxjs';
import { Clock, Game } from '../clock-model';
import { ClockService } from '../clock-service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-clock-timer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clock-timer.component.html',
  styleUrl: './clock-timer.component.css'
})
export class ClockTimerComponent {
  clock!: Clock;
  clockSub: Subscription = new Subscription();
  game!: Game;
  class: string = '';

  phaseTimeLeft: number = 0;
  phaseIndex: number = 0;
  interval: any;

  constructor(private clockService: ClockService, private activatedRoute: ActivatedRoute, @Inject(PLATFORM_ID) platformId: object) {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    let name = this.activatedRoute.snapshot.paramMap.get('name');
    if (!id) {
      id = '';
    }

    this.clockSub = this.clockService.getClockSub().subscribe(clock => {
      this.clock = clock;
      this.game = this.clock.games.find(game => game.name.toUpperCase() === name?.toUpperCase())!;
      this.setData();

      if (isPlatformBrowser(platformId)) {
        this.interval = setInterval(() => {
          this.clock.timeRemaining -= 1;
          if (this.clock.timeRemaining <= 0) {
            this.clock.timeRemaining = 0;
            if (this.class == '') {
              this.class = 'red';
            } else {
              this.class = '';
            }
          }
          this.setData();
        }, 1000);
      }

    });

    this.clockService.getClock(id);
  }

  ngOnDestroy(): void {
    this.clockSub.unsubscribe();
    clearInterval(this.interval);
  }

  setData() {
    this.setPhaseIndex();
    this.setPhaseTimeLeft();
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

  setPhaseIndex() {
    if (this.clock.timeRemaining == 0) {
      this.phaseIndex = this.game.phases.length - 1;
      return;
    }
    for (let phase of this.game.phases) {
      if (phase.end * 60 > this.clock.turnTime * 60 - this.clock.timeRemaining) {
        this.phaseIndex = this.game.phases.indexOf(phase);
        break;
      }
    }
  }

  setPhaseTimeLeft() {
    this.phaseTimeLeft = this.game.phases[this.phaseIndex].end * 60 - (this.clock.turnTime * 60 - this.clock.timeRemaining);
    if (this.phaseTimeLeft < 0) {
      this.phaseTimeLeft = 0;
    }
  }
}
