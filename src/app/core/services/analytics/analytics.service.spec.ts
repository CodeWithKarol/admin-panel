import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from './analytics.service';
import { TeamMember } from '../../models/analytics.models';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalyticsService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have mock data initialized', () => {
    expect(service.teamMembers().length).toBeGreaterThan(0);
    expect(service.metrics().length).toBeGreaterThan(0);
    expect(service.activities().length).toBeGreaterThan(0);
  });

  it('should calculate totalCompletedTasks correctly', () => {
    const expectedTotal = service.teamMembers().reduce((sum, m) => sum + m.completedTasks, 0);
    expect(service.totalCompletedTasks()).toBe(expectedTotal);
  });

  it('should add a new team member and log activity', () => {
    const initialCount = service.teamMembers().length;
    const initialActivityCount = service.activities().length;
    const newMember: TeamMember = {
      id: '999',
      name: 'New Member',
      role: 'New Role',
      squad: 'AXON_CORE',
      specializations: ['NEW_TECH'],
      avatar: 'url',
      status: 'online',
      activeTasks: 0,
      completedTasks: 0
    };

    service.addTeamMember(newMember);

    expect(service.teamMembers().length).toBe(initialCount + 1);
    expect(service.teamMembers()[0]).toEqual(newMember);
    expect(service.activities().length).toBeGreaterThan(initialActivityCount);
    expect(service.activities()[0].message).toContain('NEW_IDENTITY_INITIALIZED_ID_999');
  });

  it('should deprovision a team member and log activity', () => {
    const originalCount = service.teamMembers().length;
    const memberId = service.teamMembers()[0].id;

    service.deprovisionTeamMember(memberId);

    expect(service.teamMembers().length).toBe(originalCount - 1);
    expect(service.teamMembers().find(m => m.id === memberId)).toBeUndefined();
    expect(service.activities()[0].message).toContain(`IDENTITY_DEPROVISIONED_ID_${memberId}`);
    expect(service.activities()[0].sender).toBe('SECURITY');
  });

  it('should filter members by specialization', () => {
    service.searchQuery.set('RUST');
    const filtered = service.filteredMembers();
    
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every(m => 
      m.name.includes('RUST') || 
      m.role.includes('RUST') || 
      m.specializations.some(s => s.includes('RUST'))
    )).toBe(true);
  });

  it('should update an existing team member and log activity', () => {
    const originalMember = service.teamMembers()[0];
    const updatedMember = { ...originalMember, name: 'Updated Name' };

    service.updateTeamMember(updatedMember);

    expect(service.teamMembers()[0].name).toBe('Updated Name');
    expect(service.activities()[0].message).toContain(`IDENTITY_RECONFIGURED_FOR_OPERATOR_${originalMember.id}`);
  });

  it('should refresh data, update lastUpdated, and add an activity', async () => {
    const initialDate = service.lastUpdated();
    const initialActivityCount = service.activities().length;
    
    service.refreshData();
    expect(service.isRefreshing()).toBe(true);
    
    // Advance time by 1000ms
    await vi.advanceTimersByTimeAsync(1000);
    
    expect(service.isRefreshing()).toBe(false);
    expect(service.lastUpdated().getTime()).toBeGreaterThan(initialDate.getTime());
    // Verify side effect: an activity was added via public refreshData trigger
    expect(service.activities().length).toBeGreaterThan(initialActivityCount);
  });
});
