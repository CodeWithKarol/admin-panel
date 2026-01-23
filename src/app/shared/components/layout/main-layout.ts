import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { Toast } from '../toast/toast';
import { Breadcrumbs } from '../breadcrumbs/breadcrumbs';
import { LayoutService } from '../../../core/layout/layout-service';
import { CommandPaletteComponent } from '../command-palette/command-palette';

@Component({
  selector: 'app-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    Header,
    Sidebar,
    Toast,
    Breadcrumbs,
    CommandPaletteComponent,
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {
  layoutService = inject(LayoutService);
}
