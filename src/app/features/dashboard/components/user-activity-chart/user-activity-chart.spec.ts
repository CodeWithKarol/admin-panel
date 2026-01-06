import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserActivityChart } from './user-activity-chart';

describe('UserActivityChart', () => {
  let component: UserActivityChart;
  let fixture: ComponentFixture<UserActivityChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserActivityChart],
    }).compileComponents();

    fixture = TestBed.createComponent(UserActivityChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
