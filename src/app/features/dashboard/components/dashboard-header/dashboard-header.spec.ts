import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardHeaderComponent } from './dashboard-header';
import { By } from '@angular/platform-browser';

describe('DashboardHeaderComponent', () => {
  let component: DashboardHeaderComponent;
  let fixture: ComponentFixture<DashboardHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardHeaderComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardHeaderComponent);
    component = fixture.componentInstance;
    
    fixture.componentRef.setInput('title', 'Test Dashboard');
    fixture.componentRef.setInput('lastUpdated', new Date());
    fixture.componentRef.setInput('isRefreshing', false);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title', () => {
    const titleDe = fixture.debugElement.query(By.css('h2'));
    expect(titleDe.nativeElement.textContent).toContain('Test Dashboard');
  });

  it('should emit refresh event when refresh button clicked', () => {
    const refreshSpy = vi.spyOn(component.refresh, 'emit');
    // The refresh button is the only one left in the minimalist header gap-4 div
    const refreshBtn = fixture.debugElement.query(By.css('button.bg-accent-charcoal'));
    
    refreshBtn.nativeElement.click();
    expect(refreshSpy).toHaveBeenCalled();
  });

  it('should disable refresh button and show animate-spin when isRefreshing is true', () => {
    fixture.componentRef.setInput('isRefreshing', true);
    fixture.detectChanges();
    
    const refreshBtn = fixture.debugElement.query(By.css('button.bg-accent-charcoal'));
    const icon = refreshBtn.query(By.css('lucide-icon'));
    
    expect(refreshBtn.nativeElement.disabled).toBe(true);
    expect(icon.nativeElement.classList).toContain('animate-spin');
  });
});
