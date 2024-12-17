import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClockService } from '../clock-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Clock, Game, Phase } from '../clock-model';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clock-setup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clock-setup.component.html',
  styleUrl: '../clock.css'
})
export class ClockSetupComponent implements OnInit, OnDestroy{

  dynamicForm : FormGroup = new FormGroup({});
  form! : FormGroup;
  clock! : Clock;
  clockSub : Subscription = new Subscription();

  constructor(private clockService: ClockService, private activatedRoute: ActivatedRoute, private router : Router) {}

  ngOnDestroy(): void {
    this.clockSub.unsubscribe();
  }
  ngOnInit(): void {
    let id = this.activatedRoute.snapshot.paramMap.get('id');

    this.clockSub = this.clockService.getClockSub().subscribe(clock => {
      console.log(clock);
      this.clock = clock;
    });
    if(id) {
      this.clockService.getClock(id);
    }
  }

  addGame() {
    this.clock.topId += 1;
    this.clock.games.push({
      id: this.clock.topId,
      name: '',
      phases: [],
      topId: 0,
    });
    
  }

  removeGame(game: Game) {
    this.clock.games = this.clock.games.filter(g => g !== game);
  }

  addPhase(game: Game) {
    game.topId += 1;
    game.phases.push({
      id: game.topId,
      name: '',
      end: 0,
    });
  }

  removePhase(game: Game, phase: Phase) {
    game.phases = game.phases.filter(p => p !== phase);
  }

  saveClock() {
    console.log(this.clock);
    this.clockService.saveClock(this.clock);
    this.router.navigate(['/clock/view/', this.clock.id]);
  }
}
