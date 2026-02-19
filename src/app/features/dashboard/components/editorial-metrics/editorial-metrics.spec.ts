import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditorialMetricsComponent } from './editorial-metrics';
import { InspectorService } from '../../../../core/services/inspector/inspector.service';
import { ProjectMetric } from '../../../../core/models/analytics.models';

describe('EditorialMetricsComponent', () => {
  let component: EditorialMetricsComponent;
  let fixture: ComponentFixture<EditorialMetricsComponent>;
  let mockInspector: { open: (data: unknown, type: string) => void };

  beforeEach(async () => {
    mockInspector = { open: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [EditorialMetricsComponent],
      providers: [{ provide: InspectorService, useValue: mockInspector }],
    }).compileComponents();

    fixture = TestBed.createComponent(EditorialMetricsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('metrics', [
      { label: 'Metric 1', value: 10, change: 5, trend: 'up' },
    ]);
    fixture.detectChanges();
  });

  it('should open inspector for metric', () => {
    const metric = { label: 'Metric 1' } as ProjectMetric;
    component.openHistory(metric);
    expect(mockInspector.open).toHaveBeenCalledWith(metric, 'metric');
  });
});
