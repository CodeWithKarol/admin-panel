import { Component, input, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectMilestone } from '../../../../core/services/milestone/milestone.service';
import { LucideAngularModule, Save, X, Calendar } from 'lucide-angular';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  styles: [
    `
      input[type='date']::-webkit-calendar-picker-indicator {
        display: none;
      }
    `,
  ],
  template: `
    <div class="h-full flex flex-col bg-brand-50">
      <!-- Header -->
      <div class="p-8 border-b border-brand-200 flex items-center justify-between bg-white">
        <div>
          <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-brand-400 mb-2">
            Protocol_Configuration
          </h3>
          <h2 class="text-3xl font-black italic text-accent-charcoal tracking-tight">
            {{ project() ? 'Reconfigure Protocol' : 'Initialize Protocol' }}
          </h2>
        </div>
      </div>

      <!-- Form Content -->
      <div class="flex-1 overflow-y-auto p-8 space-y-8">
        <!-- Project Name -->
        <div class="space-y-2">
          <label
            for="projectName"
            class="text-[10px] font-black uppercase tracking-widest text-brand-400"
            >Protocol_Name</label
          >
          <input
            id="projectName"
            [(ngModel)]="formData.projectName"
            class="w-full bg-white border border-brand-200 p-4 font-black text-xl text-accent-charcoal placeholder:text-brand-300 focus:outline-none focus:border-accent-terracotta transition-colors uppercase"
            placeholder="ex. OMEGA_PROTOCOL_V2"
          />
        </div>

        <div class="grid grid-cols-2 gap-6">
          <!-- Phase -->
          <div class="space-y-2">
            <label
              for="projectPhase"
              class="text-[10px] font-black uppercase tracking-widest text-brand-400"
              >Current_Phase</label
            >
            <select
              id="projectPhase"
              [(ngModel)]="formData.phase"
              class="w-full bg-white border border-brand-200 p-3 font-mono text-sm text-accent-charcoal focus:outline-none focus:border-accent-terracotta appearance-none rounded-none"
            >
              <option value="Research">Research</option>
              <option value="Development">Development</option>
              <option value="QA">QA</option>
              <option value="Deployment">Deployment</option>
            </select>
          </div>

          <!-- Status -->
          <div class="space-y-2">
            <label
              for="projectStatus"
              class="text-[10px] font-black uppercase tracking-widest text-brand-400"
              >Operational_Status</label
            >
            <select
              id="projectStatus"
              [(ngModel)]="formData.status"
              class="w-full bg-white border border-brand-200 p-3 font-mono text-sm text-accent-charcoal focus:outline-none focus:border-accent-terracotta appearance-none rounded-none"
            >
              <option value="active">Active</option>
              <option value="upcoming">Upcoming</option>
              <option value="complete">Complete</option>
              <option value="paused">Paused</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <!-- Start Date -->
          <div class="space-y-2">
            <label
              for="startDate"
              class="text-[10px] font-black uppercase tracking-widest text-brand-400"
              >Start_Date</label
            >
            <div class="relative">
              <input
                id="startDate"
                #startDateInput
                type="date"
                [ngModel]="formatDate(formData.startDate!)"
                (ngModelChange)="updateDate('startDate', $event)"
                class="w-full bg-white border border-brand-200 p-3 pl-12 font-mono text-sm text-accent-charcoal focus:outline-none focus:border-accent-terracotta"
              />
              <lucide-icon
                [name]="Calendar"
                (click)="startDateInput.showPicker()"
                class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400 cursor-pointer hover:text-accent-terracotta transition-colors"
              ></lucide-icon>
            </div>
          </div>

          <!-- End Date -->
          <div class="space-y-2">
            <label
              for="endDate"
              class="text-[10px] font-black uppercase tracking-widest text-brand-400"
              >Target_Completion</label
            >
            <div class="relative">
              <input
                id="endDate"
                #endDateInput
                type="date"
                [ngModel]="formatDate(formData.endDate!)"
                (ngModelChange)="updateDate('endDate', $event)"
                class="w-full bg-white border border-brand-200 p-3 pl-12 font-mono text-sm text-accent-charcoal focus:outline-none focus:border-accent-terracotta"
              />
              <lucide-icon
                [name]="Calendar"
                (click)="endDateInput.showPicker()"
                class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400 cursor-pointer hover:text-accent-terracotta transition-colors"
              ></lucide-icon>
            </div>
          </div>
        </div>

        <!-- Mission Statement -->
        <div class="space-y-2">
          <label
            for="missionStatement"
            class="text-[10px] font-black uppercase tracking-widest text-brand-400"
            >Mission_Statement</label
          >
          <textarea
            id="missionStatement"
            [(ngModel)]="formData.missionStatement"
            rows="3"
            class="w-full bg-white border border-brand-200 p-4 font-serif italic text-lg text-brand-800 placeholder:text-brand-300 focus:outline-none focus:border-accent-terracotta transition-colors resize-none"
            placeholder="Define the primary objective..."
          ></textarea>
        </div>

        <!-- Status Report -->
        <div class="space-y-2">
          <label
            for="statusReport"
            class="text-[10px] font-black uppercase tracking-widest text-brand-400"
            >Status_Report</label
          >
          <textarea
            id="statusReport"
            [(ngModel)]="formData.statusReport"
            rows="3"
            class="w-full bg-white border border-brand-200 p-4 font-sans text-sm text-brand-600 focus:outline-none focus:border-accent-terracotta transition-colors resize-none"
            placeholder="Current operational standing..."
          ></textarea>
        </div>

        <!-- Internal Notes -->
        <div class="space-y-2">
          <label
            for="internalNotes"
            class="text-[10px] font-black uppercase tracking-widest text-brand-400"
            >Internal_Notes</label
          >
          <textarea
            id="internalNotes"
            [(ngModel)]="formData.internalNotes"
            rows="2"
            class="w-full bg-[#fef9c3] border border-brand-200 p-4 font-mono text-xs text-yellow-900 focus:outline-none focus:border-yellow-500 transition-colors resize-none"
            placeholder="Confidential remarks..."
          ></textarea>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="p-8 border-t border-brand-200 bg-white flex items-center gap-4">
        <button
          (click)="cancelClick.emit()"
          class="flex-1 py-4 border border-brand-200 text-xs font-black uppercase tracking-widest hover:bg-brand-50 transition-colors flex items-center justify-center gap-2 group"
        >
          <lucide-icon
            [name]="X"
            class="w-4 h-4 group-hover:scale-110 transition-transform"
          ></lucide-icon>
          Abort_Sequence
        </button>
        <button
          (click)="submit()"
          class="flex-1 py-4 bg-accent-charcoal text-white text-xs font-black uppercase tracking-widest hover:bg-accent-terracotta transition-colors flex items-center justify-center gap-2 group shadow-lg shadow-accent-charcoal/20"
        >
          <lucide-icon
            [name]="Save"
            class="w-4 h-4 group-hover:scale-110 transition-transform"
          ></lucide-icon>
          {{ project() ? 'Commit_Changes' : 'Initialize_Protocol' }}
        </button>
      </div>
    </div>
  `,
})
export class ProjectFormComponent implements OnInit {
  project = input<ProjectMilestone | null>(null);
  save = output<ProjectMilestone>();
  cancelClick = output<void>();

  protected readonly Save = Save;
  protected readonly X = X;
  protected readonly Calendar = Calendar;

  formData: Partial<ProjectMilestone> = {
    projectName: '',
    phase: 'Research',
    status: 'active',
    startDate: new Date(),
    endDate: new Date(),
    missionStatement: '',
    statusReport: '',
    internalNotes: '',
  };

  ngOnInit() {
    const p = this.project();
    if (p) {
      this.formData = { ...p };
    }
  }

  formatDate(date: Date): string {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  }

  updateDate(field: 'startDate' | 'endDate', value: string) {
    this.formData[field] = new Date(value);
  }

  submit() {
    const finalData: ProjectMilestone = {
      id: this.project()?.id || Math.random().toString(36).substring(7),
      projectName: this.formData.projectName || 'UNNAMED_PROTOCOL',
      phase: this.formData.phase || 'Research',
      status: this.formData.status || 'active',
      startDate: this.formData.startDate || new Date(),
      endDate: this.formData.endDate || new Date(),
      missionStatement: this.formData.missionStatement || '',
      statusReport: this.formData.statusReport || '',
      internalNotes: this.formData.internalNotes || '',
    };
    this.save.emit(finalData);
  }
}
