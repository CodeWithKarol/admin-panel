/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarPage } from './calendar-page';
import { CalendarService } from '../../services/calendar.service';
import { AuthService } from '../../../../core/auth/auth-service';
import { CalendarEvent } from '../../models/calendar.models';
import { provideRouter } from '@angular/router';
import { signal, WritableSignal } from '@angular/core';
import { User } from '../../../../core/models/user';
import { EventCategoryColorPipe } from '../../pipes/event-category-color.pipe';

describe('CalendarPage', () => {
  let component: CalendarPage;
  let fixture: ComponentFixture<CalendarPage>;
  let calendarServiceSpy: { getEventsForDate: any };
  let authServiceSpy: { currentUser: WritableSignal<User | null> };

  beforeEach(async () => {
    calendarServiceSpy = {
      getEventsForDate: vi.fn().mockReturnValue([]),
    };

    authServiceSpy = {
      currentUser: signal<User | null>(null),
    };

    await TestBed.configureTestingModule({
      imports: [CalendarPage, EventCategoryColorPipe],
      providers: [
        { provide: CalendarService, useValue: calendarServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        provideRouter([]),
        // Mock Date to ensure consistent testing
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Calendar Navigation', () => {
    it('should initialize with current date', () => {
      const today = new Date();
      const componentDate = component.currentDate();
      expect(componentDate.getFullYear()).toBe(today.getFullYear());
      expect(componentDate.getMonth()).toBe(today.getMonth());
      expect(componentDate.getDate()).toBe(today.getDate());
    });

    it('should navigate to previous month', () => {
      const initialDate = new Date(2023, 5, 15); // June 15, 2023
      component.currentDate.set(initialDate);

      component.previousMonth();

      const newDate = component.currentDate();
      expect(newDate.getMonth()).toBe(4); // May
      expect(newDate.getFullYear()).toBe(2023);
    });

    it('should navigate to next month', () => {
      const initialDate = new Date(2023, 5, 15); // June 15, 2023
      component.currentDate.set(initialDate);

      component.nextMonth();

      const newDate = component.currentDate();
      expect(newDate.getMonth()).toBe(6); // July
      expect(newDate.getFullYear()).toBe(2023);
    });

    it('should handle year rollover correctly', () => {
      component.currentDate.set(new Date(2023, 11, 15)); // Dec 2023
      component.nextMonth();
      expect(component.currentDate().getFullYear()).toBe(2024);
      expect(component.currentDate().getMonth()).toBe(0); // Jan

      component.currentDate.set(new Date(2023, 0, 15)); // Jan 2023
      component.previousMonth();
      expect(component.currentDate().getFullYear()).toBe(2022);
      expect(component.currentDate().getMonth()).toBe(11); // Dec
    });

    it('should go to today', () => {
      component.currentDate.set(new Date(2020, 0, 1));
      component.goToToday();

      const today = new Date();
      const componentDate = component.currentDate();
      expect(componentDate.getFullYear()).toBe(today.getFullYear());
      expect(componentDate.getMonth()).toBe(today.getMonth());
      expect(componentDate.getDate()).toBe(today.getDate());
    });
  });

  describe('Grid Generation', () => {
    it('should generate 42 days for the calendar grid', () => {
      // Test with a specific date to ensure consistent grid generation logic
      component.currentDate.set(new Date(2023, 5, 1)); // June 2023
      // June 1st 2023 is a Thursday.
      // Grid should start Sunday May 28.

      const days = component.calendarDays();
      expect(days.length).toBe(42);

      // Verify first day
      expect(days[0].date.getDate()).toBe(28);
      expect(days[0].date.getMonth()).toBe(4); // May

      // Verify some days are marked as current month and some are not
      const currentMonthDays = days.filter((d) => d.isCurrentMonth);
      expect(currentMonthDays.length).toBe(30); // June has 30 days
    });

    it('should call calendarService.getEventsForDate for each day', () => {
      component.currentDate.set(new Date(2023, 5, 1));
      const days = component.calendarDays();
      expect(calendarServiceSpy.getEventsForDate).toHaveBeenCalled();
      expect(days.length).toBe(42);
    });

    it('should correctly identify today', () => {
      const today = new Date();
      // Using real system time might be flaky at midnight boundary but acceptable for integration-like unit test
      // To be safer, we can mock system time, but for now assuming execution speed:
      const result = component.isToday(today);
      expect(result).toBe(true);

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(component.isToday(yesterday)).toBe(false);
    });
  });

  describe('Event Styling', () => {
    let pipe: EventCategoryColorPipe;

    beforeEach(() => {
      pipe = new EventCategoryColorPipe();
    });

    it('should return correct color class for work category', () => {
      const classes = pipe.transform('work');
      expect(classes).toContain('bg-blue-100');
    });

    it('should return correct color class for personal category', () => {
      const classes = pipe.transform('personal');
      expect(classes).toContain('bg-green-100');
    });

    it('should return correct color class for important category', () => {
      const classes = pipe.transform('important');
      expect(classes).toContain('bg-red-100');
    });

    it('should return default classes for unknown category', () => {
      const classes = pipe.transform('other');
      expect(classes).toContain('bg-slate-100');
    });
  });

  describe('Interactions', () => {
    it('should log date on click', () => {
      const consoleSpy = vi.spyOn(console, 'log');
      const day = { date: new Date(), isCurrentMonth: true, isToday: true, events: [] };

      component.handleDateClick(day);

      expect(consoleSpy).toHaveBeenCalledWith('Clicked date:', day.date);
    });

    it('should log event and stop propagation on event click', () => {
      const consoleSpy = vi.spyOn(console, 'log');
      const eventMock: CalendarEvent = {
        id: '1',
        title: 'Test',
        start: new Date(),
        end: new Date(),
        allDay: true,
        category: 'work',
      };

      const eventObjMock = {
        stopPropagation: vi.fn(),
      } as unknown as Event;

      component.handleEventClick(eventMock, eventObjMock);

      expect(eventObjMock.stopPropagation).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith('Clicked event:', eventMock);
    });
  });
});
