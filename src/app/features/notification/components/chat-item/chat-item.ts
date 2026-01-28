import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-chat-item',
  imports: [],
  templateUrl: './chat-item.html',
  styleUrl: './chat-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatItem {

}
