import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { MilestoneService, ProjectMilestone } from '../milestone/milestone.service';
import { ChartData } from 'chart.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private milestoneService = inject(MilestoneService);

  // Filters
  startDate = signal(new Date('2026-01-01').toISOString().split('T')[0]);
  endDate = signal(new Date('2026-12-31').toISOString().split('T')[0]);
  searchQuery = signal('');
  statusFilter = signal<string>('all');
  phaseFilter = signal<string>('all');

  // Pagination
  currentPage = signal(1);
  itemsPerPage = signal(10);

  // Sorting
  sortField = signal<keyof ProjectMilestone | ''>('');
  sortDirection = signal<'asc' | 'desc'>('asc');

  constructor() {
    // Reset pagination on filter change
    effect(
      () => {
        this.startDate();
        this.endDate();
        this.statusFilter();
        this.phaseFilter();
        this.searchQuery();
        this.currentPage.set(1);
      },
      { allowSignalWrites: true },
    );
  }

  filteredAndSortedMilestones = computed(() => {
    const start = new Date(this.startDate());
    const end = new Date(this.endDate());
    const status = this.statusFilter();
    const phase = this.phaseFilter();
    const sField = this.sortField();
    const sDir = this.sortDirection();
    const query = this.searchQuery().toLowerCase();
    const milestones = this.milestoneService.milestones();

    let filtered = milestones.filter((m) => {
      const mStart = new Date(m.startDate);
      const mEnd = new Date(m.endDate);
      const dateWait = mStart >= start && mEnd <= end;

      const statusMatch = status === 'all' || m.status === status;
      const phaseMatch = phase === 'all' || m.phase === phase;
      const queryMatch =
        !query ||
        m.projectName.toLowerCase().includes(query) ||
        (m.missionStatement?.toLowerCase().includes(query) ?? false);

      return dateWait && statusMatch && phaseMatch && queryMatch;
    });

    if (sField) {
      filtered = [...filtered].sort((a, b) => {
        const valA = a[sField];
        const valB = b[sField];

        if (valA! < valB!) return sDir === 'asc' ? -1 : 1;
        if (valA! > valB!) return sDir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  });

  paginatedMilestones = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.filteredAndSortedMilestones().slice(start, end);
  });

  activeRate = computed(() => {
    const total = this.filteredAndSortedMilestones().length;
    if (total === 0) return 0;
    const active = this.filteredAndSortedMilestones().filter((m) => m.status === 'active').length;
    return Math.round((active / total) * 100);
  });

  chartData = computed<ChartData<'bar'>>(() => {
    const milestones = this.filteredAndSortedMilestones();
    const phases = ['Research', 'Discovery', 'Development', 'QA', 'Deployment'];
    const data = phases.map((phase) => milestones.filter((m) => m.phase === phase).length);

    return {
      labels: phases,
      datasets: [
        {
          data,
          label: 'Projects',
          barThickness: 32,
          backgroundColor: '#c05640',
        },
      ],
    };
  });

  exportPdf() {
    const milestones = this.filteredAndSortedMilestones();
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(44, 40, 37); // accent-charcoal
    doc.text('Execution Ledger Report', 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);

    // Filter Summary
    doc.setFontSize(10);
    doc.text(
      `Filters: ${this.statusFilter() !== 'all' ? 'Status: ' + this.statusFilter() : ''} ${this.phaseFilter() !== 'all' ? 'Phase: ' + this.phaseFilter() : ''}`,
      14,
      38,
    );

    const data = milestones.map((m) => [
      m.projectName,
      m.phase,
      m.status,
      new Date(m.startDate).toLocaleDateString(),
      new Date(m.endDate).toLocaleDateString(),
      m.missionStatement || '',
    ]);

    autoTable(doc, {
      head: [['Protocol', 'Phase', 'Status', 'Start', 'End', 'Mission']],
      body: data,
      startY: 45,
      styles: {
        font: 'helvetica',
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [192, 86, 64], // accent-terracotta
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [250, 248, 245], // brand-50
      },
    });

    doc.save('protocol_ledger_report.pdf');
  }

  exportCsv() {
    const milestones = this.filteredAndSortedMilestones();
    if (milestones.length === 0) return;

    const data = milestones.map((m) => ({
      Project: m.projectName,
      Phase: m.phase,
      Status: m.status,
      Start: m.startDate,
      End: m.endDate,
      Mission: m.missionStatement || '',
    }));

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      Object.keys(data[0]).join(',') +
      '\n' +
      data.map((row) => Object.values(row).join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'protocol_ledger_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
