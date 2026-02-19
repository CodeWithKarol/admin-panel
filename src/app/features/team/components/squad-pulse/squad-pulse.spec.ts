import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SquadPulseComponent } from './squad-pulse';
import { AnalyticsService } from '../../../../core/services/analytics/analytics.service';
import { signal, Signal } from '@angular/core';

describe('SquadPulseComponent', () => {
  let component: SquadPulseComponent;
  let fixture: ComponentFixture<SquadPulseComponent>;

  let mockAnalyticsService: {
    readinessScore: Signal<number>;
    availabilityMatrix: Signal<{ online: number; busy: number; offline: number }>;
  };

  beforeEach(async () => {
    mockAnalyticsService = {
      readinessScore: signal(85),
      availabilityMatrix: signal({ online: 10, busy: 5, offline: 2 }),
    };

    await TestBed.configureTestingModule({
      imports: [SquadPulseComponent],
      providers: [{ provide: AnalyticsService, useValue: mockAnalyticsService }],
    }).compileComponents();

    fixture = TestBed.createComponent(SquadPulseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display readiness score', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('85');
  });

  it('should display availability matrix values', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('10'); // Online
    expect(compiled.textContent).toContain('5'); // Busy
    expect(compiled.textContent).toContain('2'); // Offline
  });
});
