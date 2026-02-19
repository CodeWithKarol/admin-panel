import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ManifestOverlayComponent } from './shared/components/navigation/manifest-overlay';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ManifestOverlayComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
