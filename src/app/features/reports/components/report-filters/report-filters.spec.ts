import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportFiltersComponent } from './report-filters';

describe('ReportFiltersComponent', () => {
  let component: ReportFiltersComponent;
  let fixture: ComponentFixture<ReportFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportFiltersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit changes on filter updates', () => {
    const searchSpy = vi.spyOn(component.searchChange, 'emit');
    const startSpy = vi.spyOn(component.startChange, 'emit');
    const endSpy = vi.spyOn(component.endChange, 'emit');
    const statusSpy = vi.spyOn(component.statusChange, 'emit');
    const phaseSpy = vi.spyOn(component.phaseChange, 'emit');

    component.searchChange.emit('test');
    component.startChange.emit('2026-01-01');
    component.endChange.emit('2026-02-01');
    component.statusChange.emit('active');
    component.phaseChange.emit('QA');

    expect(searchSpy).toHaveBeenCalledWith('test');
    expect(startSpy).toHaveBeenCalledWith('2026-01-01');
    expect(endSpy).toHaveBeenCalledWith('2026-02-01');
    expect(statusSpy).toHaveBeenCalledWith('active');
    expect(phaseSpy).toHaveBeenCalledWith('QA');
  });

  it('should emit export events', () => {
    const pdfSpy = vi.spyOn(component.exportPdf, 'emit');
    const csvSpy = vi.spyOn(component.exportCsv, 'emit');

    component.exportPdf.emit();
    component.exportCsv.emit();

    expect(pdfSpy).toHaveBeenCalled();
    expect(csvSpy).toHaveBeenCalled();
  });
});
