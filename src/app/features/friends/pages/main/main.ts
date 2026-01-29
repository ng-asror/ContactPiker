import { ChangeDetectionStrategy, Component, inject, resource, signal } from '@angular/core';
import { Friends } from '../../services';
import { filter, firstValueFrom } from 'rxjs';
import { RouterLink } from '@angular/router';
import { IFriend } from '../../interface';

@Component({
  selector: 'app-main',
  imports: [RouterLink],

  templateUrl: './main.html',
  styleUrl: './main.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Main {
  private friendsService = inject(Friends);

  //   signals
  friendsList = signal<IFriend[]>([]);

  protected friends = resource({
    loader: () =>
      firstValueFrom(this.friendsService.getFriends()).then((res) => {
        this.friendsList.set(res.friends);
        return res.friends;
      }),
  });

  //   search
  protected search(value: string): void {
    const friends = this.friends.value();
    if (friends) {
      const filterFriends = friends.filter(
        (item) =>
          item.user.first_name.toLowerCase().includes(value) ||
          item.user.last_name.toLowerCase().includes(value),
      );
      this.friendsList.set(value.length ? filterFriends : friends);
    }
  }
}
