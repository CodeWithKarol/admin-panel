import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  LucideAngularModule,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Plus,
} from 'lucide-angular';
import { CalendarService } from '../../services/calendar.service';
import { CalendarDay, CalendarEvent, ViewType } from '../../models/calendar.models';
import { HasRoleDirective } from '../../../../shared/directives/has-role.directive';
import { EventCategoryColorPipe } from '../../pipes/event-category-color.pipe';

@Component({
  selector: 'app-calendar-page',
  imports: [DatePipe, LucideAngularModule, HasRoleDirective, EventCategoryColorPipe],
  templateUrl: './calendar-page.html',
  styleUrl: './calendar-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarPage {
  private calendarService = inject(CalendarService);

  readonly currentDate = signal(new Date());
  readonly viewType = signal<ViewType>('month');

  // Icons
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly CalendarIcon = CalendarIcon;
  readonly Clock = Clock;
  readonly MapPin = MapPin;
  readonly Plus = Plus;

  readonly currentMonthName = computed(() => {
    return this.currentDate().toLocaleString('default', { month: 'long', year: 'numeric' });
  });

  readonly calendarDays = computed(() => {
    const date = this.currentDate();
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday

    // We want to start the calendar on Sunday, so we might need days from previous month
    const days: CalendarDay[] = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const dayDate = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date: dayDate,
        isCurrentMonth: false,
        isToday: this.isToday(dayDate),
        events: this.calendarService.getEventsForDate(dayDate),
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      days.push({
        date: dayDate,
        isCurrentMonth: true,
        isToday: this.isToday(dayDate),
        events: this.calendarService.getEventsForDate(dayDate),
      });
    }

    // Next month days to fill the grid (target 42 days for 6 rows, or 35 for 5)
    // Let's always do 6 rows (42 cells) to keep height consistent
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const dayDate = new Date(year, month + 1, i);
      days.push({
        date: dayDate,
        isCurrentMonth: false,
        isToday: this.isToday(dayDate),
        events: this.calendarService.getEventsForDate(dayDate),
      });
    }

    return days;
  });

  readonly weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  previousMonth() {
    this.currentDate.update((date) => {
      const newDate = new Date(date);
      newDate.setMonth(date.getMonth() - 1);
      return newDate;
    });
  }

  nextMonth() {
    this.currentDate.update((date) => {
      const newDate = new Date(date);
      newDate.setMonth(date.getMonth() + 1);
      return newDate;
    });
  }

  goToToday() {
    this.currentDate.set(new Date());
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  handleDateClick(day: CalendarDay) {
    console.log('Clicked date:', day.date);
    // Future: Open modal to add event
  }

  handleEventClick(event: CalendarEvent, e: Event) {
    e.stopPropagation();
    console.log('Clicked event:', event);
    // Future: Open modal to edit event
  }
}
