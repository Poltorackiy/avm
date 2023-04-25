class webSocket {
  constructor() {
    this.socket = new WebSocket('ws://127.0.0.1:8089');
  }

  static createWebSocket() {
    return new webSocket();
  }
  

  
  sendMessage(msg){
    socket.send(msg);
  }
};

let ws = webSocket.createWebSocket();

ws.sendMessage("pimng");


alert( ws.socket); 
