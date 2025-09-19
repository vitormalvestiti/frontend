import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationComponent } from './notification.component';

import { of } from 'rxjs';
import { NotificationService } from '../../services/notification/notification.service';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  let mockService: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('NotificationService', ['enviarNotificacao'], {
      notificacoes$: of([
        { mensagemId: '1', conteudoMensagem: 'teste', status: 'AGUARDANDO_PROCESSAMENTO' }
      ])
    });

    await TestBed.configureTestingModule({
      imports: [NotificationComponent], 
      providers: [
        { provide: NotificationService, useValue: mockService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve renderizar título e lista', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Sistema de Notificações');
    expect(compiled.querySelectorAll('li').length).toBe(1);
  });

  it('deve chamar enviarNotificacao do service quando clicar no botão', () => {
    component.conteudoMensagem = 'nova msg';
    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(mockService.enviarNotificacao).toHaveBeenCalledWith('nova msg');
  });
});
