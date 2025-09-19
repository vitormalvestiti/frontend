import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Notificacao, NotificationService } from '../../services/notification/notification.service';


@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent {
  conteudoMensagem = '';
  notificacoes: Notificacao[] = [];

  constructor(private notificationService: NotificationService) {
    this.notificationService.notificacoes$.subscribe(n => this.notificacoes = n);
  }

  enviar() {
    if (this.conteudoMensagem.trim()) {
      this.notificationService.enviarNotificacao(this.conteudoMensagem);
      this.conteudoMensagem = '';
    }
  }
}
