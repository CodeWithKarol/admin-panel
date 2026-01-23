import { Injectable, computed, signal } from '@angular/core';
import { CalendarEvent } from '../models/calendar.models';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  // State
  private readonly eventsMap = signal<Map<string, CalendarEvent>>(new Map());

  // Public signals
  readonly events = computed(() => Array.from(this.eventsMap().values()));

  constructor() {
    this.populateMockData();
  }

  addEvent(event: CalendarEvent) {
    this.eventsMap.update((map) => {
      const newMap = new Map(map);
      newMap.set(event.id, event);
      return newMap;
    });
  }

  updateEvent(event: CalendarEvent) {
    this.eventsMap.update((map) => {
      const newMap = new Map(map);
      if (newMap.has(event.id)) {
        newMap.set(event.id, event);
      }
      return newMap;
    });
  }

  deleteEvent(eventId: string) {
    this.eventsMap.update((map) => {
      const newMap = new Map(map);
      newMap.delete(eventId);
      return newMap;
    });
  }

  getEventsForDate(date: Date): CalendarEvent[] {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.events().filter((event) => {
      // Simple overlap check
      return event.start <= endOfDay && event.end >= startOfDay;
    });
  }

  private populateMockData() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const mockEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Team Weekly Sync',
        start: new Date(currentYear, currentMonth, today.getDate(), 10, 0),
        end: new Date(currentYear, currentMonth, today.getDate(), 11, 0),
        allDay: false,
        category: 'work',
        description: 'Discuss project status and blockers',
        location: 'Conference Room A',
      },
      {
        id: '2',
        title: 'Project Deadline',
        start: new Date(currentYear, currentMonth, today.getDate() + 2, 0, 0),
        end: new Date(currentYear, currentMonth, today.getDate() + 2, 23, 59),
        allDay: true,
        category: 'important',
        description: 'Q1 Deliverables due',
      },
      {
        id: '3',
        title: 'Lunch with Client',
        start: new Date(currentYear, currentMonth, today.getDate() + 5, 12, 30),
        end: new Date(currentYear, currentMonth, today.getDate() + 5, 14, 0),
        allDay: false,
        category: 'work',
        location: 'Downtown Bistro',
      },
      {
        id: '4',
        title: 'Doctor Appointment',
        start: new Date(currentYear, currentMonth, today.getDate() - 2, 15, 0),
        end: new Date(currentYear, currentMonth, today.getDate() - 2, 16, 0),
        allDay: false,
        category: 'personal',
      },
      {
        id: '5',
        title: 'Quarterly Review',
        start: new Date(currentYear, currentMonth, 15, 9, 0),
        end: new Date(currentYear, currentMonth, 15, 11, 0),
        allDay: false,
        category: 'work',
      },
    ];

    const initialMap = new Map<string, CalendarEvent>();
    mockEvents.forEach((event) => initialMap.set(event.id, event));
    this.eventsMap.set(initialMap);
  }
}
