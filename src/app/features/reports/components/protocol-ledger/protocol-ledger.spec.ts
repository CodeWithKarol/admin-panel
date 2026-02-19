import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProtocolLedgerComponent } from './protocol-ledger';
import { ProjectMilestone } from '../../../../core/services/milestone/milestone.service';
import { ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-angular';

describe('ProtocolLedgerComponent', () => {
  let component: ProtocolLedgerComponent;
  let fixture: ComponentFixture<ProtocolLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProtocolLedgerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProtocolLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit sort on onSort', () => {
    const sortSpy = vi.spyOn(component.sort, 'emit');
    component.onSort('projectName');
    expect(sortSpy).toHaveBeenCalledWith('projectName');
  });

  it('should emit rowClick on row click', () => {
    const clickSpy = vi.spyOn(component.rowClick, 'emit');
    const mockProj = { id: '1', projectName: 'P1' } as ProjectMilestone;

    fixture.componentRef.setInput('milestones', [mockProj]);
    fixture.detectChanges();

    const row = fixture.nativeElement.querySelector('tbody tr');
    row.click();

    expect(clickSpy).toHaveBeenCalledWith(mockProj);
  });

  it('should return correct sort icons', () => {
    // Diff field
    fixture.componentRef.setInput('sortField', 'phase');
    expect(component.getSortIcon('projectName')).toBe(ArrowUpDown);

    // Same field, asc
    fixture.componentRef.setInput('sortField', 'projectName');
    fixture.componentRef.setInput('sortDirection', 'asc');
    expect(component.getSortIcon('projectName')).toBe(ChevronUp);

    // Same field, desc
    fixture.componentRef.setInput('sortDirection', 'desc');
    expect(component.getSortIcon('projectName')).toBe(ChevronDown);
  });
});
