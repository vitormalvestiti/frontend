# Frontend - Sistema de Notificações Assíncronas

## Descrição
Frontend desenvolvido em **Angular** que consome o backend NestJS e exibe notificações em tempo real usando **WebSocket (Socket.IO)**.

---

## Tecnologias
- Angular
- HttpClient (requisições REST)
- Socket.IO Client (WebSocket)
- Karma + Jasmine (testes)
- UUID (geração de IDs únicos)

---

## Funcionalidades
- Enviar notificações ao backend (`POST /api/notificar`).
- Gerar automaticamente um `mensagemId` para rastreamento.
- Exibir lista de notificações e seus status:
  - **AGUARDANDO_PROCESSAMENTO**
  - **PROCESSADO_SUCESSO**
  - **FALHA_PROCESSAMENTO**
- Atualização em tempo real via WebSocket.

---

## Executar localmente
```bash
# instalar dependências
npm install

# rodar em dev
ng serve --open
```

O app ficará disponível em:  
[http://localhost:4200](http://localhost:4200)

---

## Testes
```bash
ng test
```

Testes unitários verificam:
- Geração e envio de notificação.
- Renderização da lista com status inicial.
- Atualização do status na view.

---

## WebSocket
O frontend conecta automaticamente ao backend em `http://localhost:3000`  
e ouve os eventos `statusUpdate`:

```ts
this.socket.on('statusUpdate', (data) => {
  console.log('Status atualizado:', data);
});
```
