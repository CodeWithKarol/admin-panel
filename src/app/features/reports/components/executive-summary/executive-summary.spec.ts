import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExecutiveSummaryComponent } from './executive-summary';

describe('ExecutiveSummaryComponent', () => {
  let component: ExecutiveSummaryComponent;
  let fixture: ComponentFixture<ExecutiveSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExecutiveSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExecutiveSummaryComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('totalCount', 42);
    fixture.componentRef.setInput('activeRate', 75);
    fixture.componentRef.setInput('forecast', 'Q4');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display inputs correctly', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('42');
    expect(compiled.textContent).toContain('75%');
    expect(compiled.textContent).toContain('Q4');
  });
});
