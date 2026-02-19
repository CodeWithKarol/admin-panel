import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DispatchDeskComponent } from './dispatch-desk';
import { AnalyticsService } from '../../../../core/services/analytics/analytics.service';
import { signal, Signal } from '@angular/core';

describe('DispatchDeskComponent', () => {
  let component: DispatchDeskComponent;
  let fixture: ComponentFixture<DispatchDeskComponent>;
  let mockAnalytics: { activities: Signal<unknown[]> };

  beforeEach(async () => {
    mockAnalytics = {
      activities: signal([
        { id: '1', sender: 'SYST', message: 'MSG', type: 'SYSTEM', timestamp: new Date() },
      ]),
    };

    await TestBed.configureTestingModule({
      imports: [DispatchDeskComponent],
      providers: [{ provide: AnalyticsService, useValue: mockAnalytics }],
    }).compileComponents();

    fixture = TestBed.createComponent(DispatchDeskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should expose activities from service', () => {
    expect(component.activities()).toEqual(mockAnalytics.activities());
  });
});
