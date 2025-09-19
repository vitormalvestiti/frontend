import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NotificationService],
    });

    service = TestBed.inject(NotificationService);
    httpMock = TestBed.inject(HttpTestingController);

    // 🔧 Mock do socket para não abrir conexão real
    (service as any).socket = {
      on: jasmine.createSpy('on'),
      emit: (event: string, data: any) => {
        if (event === 'statusUpdate') {
          const notificacoes = service.notificacoes$.getValue();
          const index = notificacoes.findIndex((n) => n.mensagemId === data.mensagemId);
          if (index !== -1) {
            notificacoes[index].status = data.status;
            service.notificacoes$.next([...notificacoes]);
          }
        }
      },
    };
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve criar uma notificação com status AGUARDANDO_PROCESSAMENTO', () => {
    service.enviarNotificacao('teste mensagem');

    const req = httpMock.expectOne('http://localhost:3000/api/notificar');
    expect(req.request.method).toBe('POST');
    req.flush({}); 

    const notificacoes = service.notificacoes$.getValue();
    expect(notificacoes.length).toBe(1);
    expect(notificacoes[0].conteudoMensagem).toBe('teste mensagem');
    expect(notificacoes[0].status).toBe('AGUARDANDO_PROCESSAMENTO');
  });

  it('deve chamar o backend ao enviar notificação', () => {
    service.enviarNotificacao('teste api');

    const req = httpMock.expectOne('http://localhost:3000/api/notificar');
    expect(req.request.method).toBe('POST');
    req.flush({}); 
  });

  it('deve atualizar status quando recebe evento via WebSocket', () => {
    service.enviarNotificacao('teste socket');
    const req = httpMock.expectOne('http://localhost:3000/api/notificar');
    req.flush({}); 

    const id = service.notificacoes$.getValue()[0].mensagemId;

 
    (service as any).socket.emit('statusUpdate', { mensagemId: id, status: 'PROCESSADO_SUCESSO' });

    const notif = service.notificacoes$.getValue()[0];
    expect(notif.status).toBe('PROCESSADO_SUCESSO');
  });
});
