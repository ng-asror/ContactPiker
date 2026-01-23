import { ChangeDetectionStrategy, Component, inject, resource } from '@angular/core';
import { Friends } from '../../services';
import { firstValueFrom } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-main',
	imports: [RouterLink],

	templateUrl: './main.html',
	styleUrl: './main.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Main {
	private friendsService = inject(Friends);

	protected friends = resource({
		loader: () => firstValueFrom(this.friendsService.getFriends())
	})
}
