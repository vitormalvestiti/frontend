import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';
import { v4 as uuid } from 'uuid';
import { BehaviorSubject } from 'rxjs';

export interface Notificacao {
  mensagemId: string;
  conteudoMensagem: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private apiUrl = 'http://localhost:3000/api/notificar';
  private socket: Socket;
  private notificacoes: Notificacao[] = [];

  notificacoes$ = new BehaviorSubject<Notificacao[]>([]);

  constructor(private http: HttpClient) {
    this.socket = io('http://localhost:3000');
    this.socket.on('statusUpdate', (data: any) => {
      const notif = this.notificacoes.find(n => n.mensagemId === data.mensagemId);
      if (notif) {
        notif.status = data.status;
        this.notificacoes$.next([...this.notificacoes]);
      }
    });
  }

  enviarNotificacao(conteudoMensagem: string) {
    const mensagemId = uuid();
    const nova: Notificacao = { mensagemId, conteudoMensagem, status: 'AGUARDANDO_PROCESSAMENTO' };
    this.notificacoes.push(nova);
    this.notificacoes$.next([...this.notificacoes]);

    this.http.post(this.apiUrl, { mensagemId, conteudoMensagem }).subscribe();
  }
}
