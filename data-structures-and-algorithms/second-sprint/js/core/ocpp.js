class OCPPMessageBus {
  constructor() {
    this.messageLog = [];
    this.queue = new Queue();
  }

  send(action, payload) {
    const id = "msg_" + Date.now();
    const frame = [2, id, action, payload];
    this.queue.enqueue(frame);
    this._log("→ SEND", action, payload);
    setTimeout(() => this._autoRespond(id, action), 300);
    return id;
  }

  _autoRespond(id, action) {
    const responses = {
      BootNotification: { status: "Accepted", currentTime: new Date().toISOString(), interval: 30 },
      Authorize:        { idTagInfo: { status: "Accepted" } },
      StartTransaction: { transactionId: Math.floor(Math.random() * 9000 + 1000), idTagInfo: { status: "Accepted" } },
      StopTransaction:  { idTagInfo: { status: "Accepted" } },
      MeterValues:      {},
    };
    const resp = responses[action] || {};
    this._log("← RECV", action + "Response", resp);
  }

  _log(direction, action, payload) {
    this.messageLog.unshift({ ts: formatTime(new Date()), direction, action, payload });
    if (this.messageLog.length > 50) this.messageLog.pop();
    if (typeof renderOcppLog === "function") renderOcppLog();
  }
}

const ocppBus = new OCPPMessageBus();
