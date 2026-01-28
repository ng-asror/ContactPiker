import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IMessage } from '../../interfaces';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-message',
  imports: [DatePipe],
  templateUrl: './message.html',
  styleUrl: './message.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Message {
  message = input.required<IMessage>({alias: 'data'});
  type = input.required<'left'|'right'>({alias:'position'});
} 
