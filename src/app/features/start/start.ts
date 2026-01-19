import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-start',
  imports: [RouterLinkWithHref],
  templateUrl: './start.html',
  styleUrl: './start.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Start {}
