import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../../core/services/navigation/navigation.service';

@Component({
  selector: 'app-manifest-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manifest-overlay.html',
})
export class ManifestOverlayComponent {
  nav = inject(NavigationService);
  isTransitioning = this.nav.isTransitioning;
}
