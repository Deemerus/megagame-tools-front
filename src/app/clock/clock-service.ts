import { HttpClient } from "@angular/common/http";
import { Clock } from "./clock-model";
import { Subject } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class ClockService {
    BACKEND_URL = import.meta.env['NG_APP_BACKEND_URL'] + "/clock";
    clock!: Clock;
    clockSub: Subject<Clock> = new Subject<Clock>();
    clockCreatedSub: Subject<string> = new Subject<string>();

    constructor(private http: HttpClient) { }

    getClockSub() {
        return this.clockSub.asObservable();
    }

    getClockCreatedSub() {
        return this.clockCreatedSub.asObservable();
    }

    createNewClock() {
        this.http.post<Clock>(this.BACKEND_URL + '/create', {}).subscribe(response => {
            if (response) {
                this.clockCreatedSub.next(response.id);
            }
        }, error => {
            console.log(error);
        });
    }

    getClock(id: string) {
        if(id) {
            this.http.get<Clock>(this.BACKEND_URL + '/' + id).subscribe(response => {
                if (response) {
                    this.clock = response;
                    this.assignIds(this.clock);
                    this.clockSub.next(this.clock);
                }
            }, error => {
                console.log(error);
            });
        }
    }

    saveClock(clock: Clock) {
        this.http.put<Clock>(this.BACKEND_URL + '/save', clock).subscribe(response => {
            if (response) {
                this.clock = response;
                this.assignIds(this.clock);
                this.clockSub.next(this.clock);
            }
        }, error => {
            console.log(error);
        });
    }

    startClock(id: string) {
        this.http.post<Clock>(this.BACKEND_URL + '/start?id=' + id, {}).subscribe(response => {
            if (response) {
                this.clock = response;
                this.assignIds(this.clock);
                this.clockSub.next(this.clock);
            }
        }, error => {
            console.log(error);
        });
    }

    private assignIds(clock: Clock) {
        clock.topId = clock.games.length;
        for (let i = 0; i < this.clock.games.length; i++) {
            this.clock.games[i].id = i;
            this.clock.games[i].topId = this.clock.games[i].phases.length;
            for (let j = 0; j < this.clock.games[i].phases.length; j++) {
                this.clock.games[i].phases[j].id = j;
            }
        }
    }

}