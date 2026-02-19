import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SquadronMatrixComponent } from './squadron-matrix';
import { AnalyticsService } from '../../../../core/services/analytics/analytics.service';
import { signal, Signal } from '@angular/core';

describe('SquadronMatrixComponent', () => {
  let component: SquadronMatrixComponent;
  let fixture: ComponentFixture<SquadronMatrixComponent>;
  let mockAnalytics: { squadMetrics: Signal<unknown[]> };

  beforeEach(async () => {
    mockAnalytics = {
      squadMetrics: signal([
        { name: 'SQUAD1', count: 10, velocity: 100, strain: 2, personnel: [0, 0] },
      ]),
    };

    await TestBed.configureTestingModule({
      imports: [SquadronMatrixComponent],
      providers: [{ provide: AnalyticsService, useValue: mockAnalytics }],
    }).compileComponents();

    fixture = TestBed.createComponent(SquadronMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should expose squadMetrics from service', () => {
    expect(component.squadMetrics()).toEqual(mockAnalytics.squadMetrics());
  });
});
