import { Routes } from '@angular/router';
import { ClockComponent } from './clock/clock/clock.component';
import { ClockSetupComponent } from './clock/clock-setup/clock-setup.component';
import { ClockTimerComponent } from './clock/clock-timer/clock-timer.component';
import { ClockViewComponent } from './clock/clock-view/clock-view.component';

export const routes: Routes = [
    { path: 'clock', component: ClockComponent },
    { path: 'clock/view/:id', component: ClockViewComponent},
    { path: 'clock/setup/:id', component: ClockSetupComponent},
    { path: 'clock/timer/:id/:name', component: ClockTimerComponent }
];
