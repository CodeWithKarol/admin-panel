import { Component, input, output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamMember } from '../../../../core/models/analytics.models';
import { LucideAngularModule, Save, X, Fingerprint, RefreshCcw } from 'lucide-angular';
import { SQUADS, ROLES } from '../../../../core/models/team.constants';
import { AnalyticsService } from '../../../../core/services/analytics/analytics.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div class="flex items-center gap-4 text-accent-terracotta">
        <lucide-icon [name]="Fingerprint" class="w-6 h-6"></lucide-icon>
        <h4 class="text-[10px] font-black uppercase tracking-[0.4em]">Identity_Matrix_Override</h4>
      </div>

      <form (ngSubmit)="submit()" class="space-y-10">
        <!-- Name Field -->
        <div class="flex items-start gap-8">
          <!-- Avatar Section -->
          <div class="relative shrink-0 group/avatar">
            <div
              class="w-24 h-24 bg-brand-100/50 rounded-sm overflow-hidden border border-brand-200"
            >
              <img
                [src]="formData.avatar"
                class="w-full h-full object-cover grayscale opacity-80"
                alt="Avatar Preview"
              />
            </div>
            <button
              type="button"
              (click)="regenerateAvatar()"
              class="absolute inset-0 bg-accent-charcoal/80 flex flex-col items-center justify-center gap-2 text-white opacity-0 group-hover/avatar:opacity-100 transition-all cursor-pointer"
            >
              <lucide-icon [name]="RefreshCcw" class="w-5 h-5"></lucide-icon>
              <span class="text-[8px] font-black uppercase tracking-widest">Reroll</span>
            </button>
          </div>

          <div class="flex-1 space-y-6">
            <!-- Name Field -->
            <div class="group space-y-2">
              <label
                for="p_name"
                class="text-[9px] font-black text-brand-400 uppercase tracking-widest group-focus-within:text-accent-terracotta transition-colors"
              >
                Personnel_Nominal
              </label>
              <input
                id="p_name"
                type="text"
                [(ngModel)]="formData.name"
                name="name"
                class="w-full bg-transparent border-b border-brand-200 focus:border-accent-terracotta outline-none text-2xl font-black uppercase tracking-tighter py-2 transition-all"
              />
            </div>

            <div class="grid grid-cols-2 gap-6">
              <!-- Role Field -->
              <div class="group space-y-2">
                <label
                  for="p_role"
                  class="text-[9px] font-black text-brand-400 uppercase tracking-widest group-focus-within:text-accent-terracotta transition-colors"
                >
                  Operational_Designation
                </label>
                <select
                  id="p_role"
                  [(ngModel)]="formData.role"
                  name="role"
                  class="w-full bg-transparent border-b border-brand-200 focus:border-accent-terracotta outline-none text-sm font-serif italic text-accent-charcoal py-2 appearance-none cursor-pointer"
                >
                  <option value="" disabled selected>Select_Designation</option>
                  @for (role of roles; track role) {
                    <option [value]="role">{{ role }}</option>
                  }
                </select>
              </div>

              <!-- Squad Field -->
              <div class="group space-y-2">
                <label
                  for="p_squad"
                  class="text-[9px] font-black text-brand-400 uppercase tracking-widest group-focus-within:text-accent-terracotta transition-colors"
                >
                  Assigned_Squad
                </label>
                <select
                  id="p_squad"
                  [(ngModel)]="formData.squad"
                  name="squad"
                  class="w-full bg-transparent border-b border-brand-200 focus:border-accent-terracotta outline-none text-sm font-bold uppercase tracking-widest text-accent-charcoal py-2 appearance-none cursor-pointer"
                >
                  @for (squad of squads; track squad) {
                    <option [value]="squad">{{ squad }}</option>
                  }
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Specializations Field -->
        <div class="group space-y-2">
          <label
            for="p_specs"
            class="text-[9px] font-black text-brand-400 uppercase tracking-widest group-focus-within:text-accent-terracotta transition-colors"
          >
            Personnel_Specializations (Comma_Separated)
          </label>
          <input
            id="p_specs"
            type="text"
            [(ngModel)]="specInput"
            name="specs"
            class="w-full bg-transparent border-b border-brand-200 focus:border-accent-terracotta outline-none text-xs font-mono font-bold uppercase tracking-widest py-2 transition-all"
          />
        </div>

        <!-- Bio Field -->
        <div class="group space-y-2">
          <label
            for="p_bio"
            class="text-[9px] font-black text-brand-400 uppercase tracking-widest group-focus-within:text-accent-terracotta transition-colors"
          >
            Biological_Narrative
          </label>
          <textarea
            id="p_bio"
            [(ngModel)]="formData.bio"
            name="bio"
            rows="4"
            class="w-full bg-brand-100/50 border border-brand-200 focus:border-accent-terracotta outline-none p-4 text-sm font-serif italic text-brand-800 transition-all resize-none"
          ></textarea>
        </div>

        <!-- Status & Meta -->
        <div class="grid grid-cols-2 gap-8 pt-4">
          <div class="group space-y-2">
            <label
              for="p_status"
              class="text-[9px] font-black text-brand-400 uppercase tracking-widest group-focus-within:text-accent-terracotta transition-colors"
            >
              Deployment_State
            </label>
            <select
              id="p_status"
              [(ngModel)]="formData.status"
              name="status"
              class="w-full bg-transparent border-b border-brand-200 focus:border-accent-terracotta outline-none text-xs font-bold uppercase tracking-widest py-2 appearance-none cursor-pointer"
            >
              <option value="online">Online</option>
              <option value="busy">Busy</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-4 pt-12">
          <button
            type="submit"
            class="flex-1 bg-accent-charcoal text-white py-4 text-xs font-black uppercase tracking-[0.2em] hover:bg-accent-terracotta transition-all duration-500 flex items-center justify-center gap-3"
          >
            <lucide-icon [name]="Save" class="w-4 h-4"></lucide-icon>
            Commit_Changes
          </button>
          <button
            type="button"
            (click)="identityAborted.emit()"
            class="px-8 border border-brand-200 text-xs font-black uppercase tracking-[0.2em] hover:bg-brand-100 transition-all duration-500 flex items-center justify-center gap-3"
          >
            <lucide-icon [name]="X" class="w-4 h-4"></lucide-icon>
            Abort
          </button>
        </div>
      </form>
    </div>
  `,
})
export class UserFormComponent implements OnInit {
  user = input<(TeamMember & { bio?: string }) | null>(null);
  identityCommitted = output<TeamMember>();
  identityAborted = output<void>();

  private analyticsService = inject(AnalyticsService);

  protected readonly Save = Save;
  protected readonly X = X;
  protected readonly Fingerprint = Fingerprint;
  protected readonly RefreshCcw = RefreshCcw;

  squads = SQUADS;
  roles = ROLES;

  formData = {
    name: '',
    role: '' as string,
    squad: SQUADS[0] as TeamMember['squad'],
    status: 'online' as TeamMember['status'],
    bio: '',
    avatar: '',
  };
  specInput = '';

  ngOnInit() {
    const existingUser = this.user();
    if (existingUser) {
      this.formData = {
        name: existingUser.name,
        role: existingUser.role,
        squad: existingUser.squad,
        status: existingUser.status,
        bio: existingUser.bio || '',
        avatar: existingUser.avatar,
      };
      this.specInput = existingUser.specializations.join(', ');
    } else {
      this.regenerateAvatar();
    }
  }

  regenerateAvatar() {
    this.formData.avatar = this.analyticsService.generateAvatarUrl();
  }

  submit() {
    const existingUser = this.user();
    if (existingUser) {
      this.identityCommitted.emit(
        this.analyticsService.prepareUpdate(existingUser, {
          ...this.formData,
          specInput: this.specInput,
        }),
      );
    } else {
      this.identityCommitted.emit(
        this.analyticsService.createTeamMember({
          ...this.formData,
          specInput: this.specInput,
        }),
      );
    }
  }
}
