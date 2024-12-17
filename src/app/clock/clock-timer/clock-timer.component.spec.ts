import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClockTimerComponent } from './clock-timer.component';

describe('ClockTimerComponent', () => {
  let component: ClockTimerComponent;
  let fixture: ComponentFixture<ClockTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClockTimerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClockTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
