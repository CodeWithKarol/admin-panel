import { TestBed } from '@angular/core/testing';
import { BroadcastService } from './broadcast.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { ModalService } from '../modal/modal.service';
import { signal } from '@angular/core';
import { DispatchEntry } from '../../models/dispatch.models';

describe('BroadcastService', () => {
  let service: BroadcastService;
  let analyticsService: { activities: ReturnType<typeof signal<DispatchEntry[]>> };
  let modalService: { close: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    analyticsService = {
      activities: signal<DispatchEntry[]>([]),
    };
    modalService = {
      close: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        BroadcastService,
        { provide: AnalyticsService, useValue: analyticsService },
        { provide: ModalService, useValue: modalService },
      ],
    });
    service = TestBed.inject(BroadcastService);
  });

  it('should update activities and close modal when broadcasting alert', () => {
    service.broadcastAlert();

    expect(analyticsService.activities().length).toBe(1);
    expect(analyticsService.activities()[0]).toEqual(
      expect.objectContaining({
        sender: 'COMMAND_OVERRIDE',
        message: 'GLOBAL_PRIORITY_BROADCAST_INITIATED',
        type: 'URGENT',
      }),
    );
    expect(modalService.close).toHaveBeenCalled();
  });
});
