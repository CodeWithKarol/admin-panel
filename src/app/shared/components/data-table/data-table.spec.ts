import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataTable } from './data-table';
import { TableColumn } from './data-table.models';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
  name: string;
  role: string;
}

describe('DataTable', () => {
  let component: DataTable<User>;
  let fixture: ComponentFixture<DataTable<User>>;

  const mockData: User[] = [
    { id: 1, name: 'John Doe', role: 'Admin' },
    { id: 2, name: 'Jane Smith', role: 'User' },
    { id: 3, name: 'Bob Jones', role: 'User' },
  ];

  const mockColumns: TableColumn<User>[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'role', header: 'Role', sortable: true },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTable, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DataTable<User>);
    component = fixture.componentInstance;

    // Set required inputs
    fixture.componentRef.setInput('data', mockData);
    fixture.componentRef.setInput('columns', mockColumns);
    fixture.componentRef.setInput('pageSize', 10);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render headers', () => {
    const headers = fixture.debugElement.queryAll(By.css('th'));
    // 2 columns.
    expect(headers.length).toBe(2);
    expect(headers[0].nativeElement.textContent).toContain('Name');
    expect(headers[1].nativeElement.textContent).toContain('Role');
  });

  it('should render rows', () => {
    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(3);
    expect(rows[0].nativeElement.textContent).toContain('John Doe');
  });

  it('should paginate', () => {
    fixture.componentRef.setInput('pageSize', 1);
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(1);
    expect(rows[0].nativeElement.textContent).toContain('John Doe');
    // should show pagination
  });
});
