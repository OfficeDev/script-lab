import * as log from '../log';

/* TODO: for now, copy-pasted this file from an external source -- so disable tslint temporarily */
/* tslint:disable */

declare namespace OfficeExtension {
  interface HttpRequestInfo {
    /** HTTP request method */
    method: string;
    /** Request URL */
    url: string;
    /** Request headers */
    headers: { [name: string]: string };
    /** Request body */
    body: string | any;
  }

  /**
   * HTTP response information.
   */
  interface HttpResponseInfo {
    /** Response status code */
    statusCode: number;
    /** Response headers */
    headers: { [name: string]: string };
    /** Response body */
    body: string | any;
  }

  class HttpUtility {
    static sendLocalDocumentRequest(request: HttpRequestInfo): Promise<HttpResponseInfo>;
  }
}

export interface JupyterConnectionInfo {
  token: string;
  baseUrl: string;
}

interface JupyterWebSocketMessageHeader {
  msg_id?: string;
  msg_type?: string;
  username?: string;
  session?: string;
  date?: string;
  version?: string;
}

interface JupyterWebSocketMessage {
  header: JupyterWebSocketMessageHeader;
  msg_id: string;
  msg_type: string;
  parent_header?: JupyterWebSocketMessageHeader;
  metadata: any;
  content: any;
  buffers: any[];
  channel: string;
}

interface JuypterWebSocketMessageExecuteReplyContent {
  status: 'ok' | string;
}

interface JuypterWebSocketMessageExecuteResultContent {
  data: { [key: string]: any };
  metadata?: { [key: string]: any };
  execution_count: number;
}

interface JupyterWebSocketMessageInputRequestContent {
  prompt: string;
  password: boolean;
}

interface JupyterWebSocketMessageInputReplyContent {
  value: string;
}

interface JupyterWebSocketMessageStreamResultContent {
  name: string,
  text: string
}

enum JupyterWebSocketMessageType {
  execute_result = 'execute_result',
  stream = "stream",
}
/*
var msg =
    { "header": 
        {
            "msg_id": "960fa11f-be831bb05301a5c2b95b379c", 
            "msg_type": "execute_result", 
            "username": "username", 
            "session": "1ff9a80a-9e20eb2b4ff2d3ad35d10bc2", 
            "date": "2019-03-25T04:59:30.661474Z", 
            "version": "5.3" 
        }, 
        "msg_id": "960fa11f-be831bb05301a5c2b95b379c", 
        "msg_type": "execute_result",
        "parent_header": 
            { 
                "msg_id": "abe66fa0b98c4c07a8dce0ba5985a6ad", 
                "username": "username", 
                "session": "84db38e52f6140b087196b72276a456a", 
                "msg_type": "execute_request", 
                "version": "5.2", 
                "date": "2019-03-25T04:59:30.657479Z" 
            }, 
            "metadata": {}, 
            "content": 
                { "data": { "text/plain": "142" }, "metadata": {}, "execution_count": 7 }, 
            "buffers": [], 
            "channel": "iopub" 
        };
*/

export class JupyterNotebook {
  private m_sessionId: string;
  private m_kernelId: string;
  private m_channelSessionId: string;
  private m_ws: WebSocket;
  private m_executePromiseMap: { [key: string]: (value: string) => void };
  private m_connected: boolean;

  constructor(private m_conn: JupyterConnectionInfo, private m_path: string) {
    this.m_executePromiseMap = {};
  }

  private connect(): Promise<void> {
    let url = Util.combineUrl(this.m_conn.baseUrl, 'api/sessions');
    let sessionCreationInfo = {
      path: this.m_path,
      type: 'notebook',
      name: '',
      kernel: {
        id: null,
        name: 'python3',
      },
    };

    return fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'token ' + this.m_conn.token,
      },
      method: 'POST',
      cache: 'no-cache',
      body: JSON.stringify(sessionCreationInfo),
    })
      .then(response => response.json())
      .then(returnData => {
        this.m_sessionId = returnData.id;
        this.m_kernelId = returnData.kernel.id;
        this.m_channelSessionId = Util.uuid();

        let wsUrl: string;
        if (this.m_conn.baseUrl.substr(0, 'http://'.length) === 'http://') {
          wsUrl = 'ws://' + this.m_conn.baseUrl.substr('http://'.length);
        } else if (this.m_conn.baseUrl.substr(0, 'https://'.length) === 'https://') {
          wsUrl = 'wss://' + this.m_conn.baseUrl.substr('https://'.length);
        }

        wsUrl = Util.combineUrl(
          wsUrl,
          'api/kernels/' +
          this.m_kernelId +
          '/channels?token=' +
          this.m_conn.token +
          '&session_id=' +
          this.m_channelSessionId,
        );
        Util.log('WebSocket url:' + wsUrl);
        return new Promise<void>((resolve, reject) => {
          this.m_ws = new WebSocket(wsUrl);
          this.m_ws.onopen = () => {
            Util.log('onopen');
            resolve();
          };
          this.m_ws.onmessage = (e: MessageEvent) => {
            Util.log('onmessage');
            if (typeof e.data === 'string') {
              Util.log(e.data);
              let msg: JupyterWebSocketMessage = JSON.parse(e.data);
              this.handleWebSocketMessage(msg);
            } else {
              Util.log('unknown message');
            }
          };
          this.m_ws.onclose = () => {
            Util.log('onclose');
          };
          this.m_ws.onerror = () => {
            Util.log('onerror');
          };
        });
      });
  }

  async ensureConnected(): Promise<void> {
    if (!this.m_connected) {
      await this.connect();
      this.m_connected = true;
    }
  }

  executeCode(code: string): Promise<any> {
    return this.ensureConnected().then(() => {
      var content = {
        code: code,
        silent: false,
        store_history: true,
        user_expressions: {},
        allow_stdin: true,
        stop_on_error: true,
      };

      let p = new Promise<string>((resolve, reject) => {
        let msgId = this.sendShellMessage('execute_request', content, null);
        this.m_executePromiseMap[msgId] = resolve;
      });

      return p;
    });
  }

  private sendShellMessage(msgType: string, content: any, metadata: any): string {
    let msg = this.buildMessage('shell', msgType, content, metadata);
    let stringMessage = JSON.stringify(msg);
    Util.log('sending:' + stringMessage);
    this.m_ws.send(stringMessage);
    return msg.msg_id;
  }

  private buildMessage(
    channel: string,
    msgType: string,
    content: any,
    metadata: any,
  ): JupyterWebSocketMessage {
    let msgId = Util.uuid();
    var msg = {
      header: {
        msg_id: msgId,
        username: 'username',
        session: this.m_channelSessionId,
        msg_type: msgType,
        version: '5.2',
      },
      msg_id: msgId,
      msg_type: msgType,
      metadata: metadata || {},
      content: content,
      buffers: [],
      parent_header: {},
      channel: channel,
    };
    return msg;
  }

  private handleWebSocketMessage(msg: JupyterWebSocketMessage) {
    switch (msg.channel) {
      case 'shell':
        return this.handleShellReply(msg);
      case 'iopub':
        return this.handleIopubMessage(msg);
      case 'stdin':
        return this.handleInputRequest(msg);
      default:
        console.error('unrecognized message channel', msg.channel, msg);
    }
  }

  private handleShellReply(msg: JupyterWebSocketMessage) { }

  private handleIopubMessage(msg: JupyterWebSocketMessage) {
    if (msg.msg_type === JupyterWebSocketMessageType.execute_result) {
      let content: JuypterWebSocketMessageExecuteResultContent = msg.content;
      let text = content.data['text/plain'];
      let parentMsgId = msg.parent_header.msg_id;
      let resolve = this.m_executePromiseMap[parentMsgId];
      Util.log('ExecuteResult=' + text);
      if (resolve) {
        delete this.m_executePromiseMap[parentMsgId];
        resolve(text);
      }
    }
    else if (msg.msg_type == JupyterWebSocketMessageType.stream) {
      const content: JupyterWebSocketMessageStreamResultContent = msg.content;
      if (content.name === 'stdout') {
        let text = content.text;
        if (!Util.isNullOrEmptyString(text)) {
          text = text.replace('\\n', '');
        }

        Util.logConsole(text);
      }
    }
  }

  private handleInputRequest(msg: JupyterWebSocketMessage) {
    let content: JupyterWebSocketMessageInputRequestContent = msg.content;
    const officeApiPrefix = '[Office-Api]';
    if (
      typeof content.prompt === 'string' &&
      content.prompt.substr(0, officeApiPrefix.length) === officeApiPrefix
    ) {
      let requestInfoStr = content.prompt.substr(officeApiPrefix.length);
      let requestInfo: OfficeExtension.HttpRequestInfo = JSON.parse(requestInfoStr);
      OfficeExtension.HttpUtility.sendLocalDocumentRequest(requestInfo).then(
        (responseInfo: OfficeExtension.HttpResponseInfo) => {
          let responseInfoStr = JSON.stringify(responseInfo);
          let respMsg = this.buildMessage(
            'stdin',
            'input_reply',
            { value: responseInfoStr },
            null,
          );
          respMsg.parent_header = msg.header;
          let strRespMsg = JSON.stringify(respMsg);
          Util.log('sending:' + strRespMsg);
          this.m_ws.send(strRespMsg);
        },
      );
    }
  }
}

export class PythonCodeHelper {
  static buildFunctionInvokeStatement(functionName: string, parameters: any[]): string {
    let ret = functionName;
    ret += '(';
    if (parameters) {
      for (let i = 0; i < parameters.length; i++) {
        if (i !== 0) {
          ret += ', ';
        }
        ret += PythonCodeHelper.buildLiteral(parameters[i]);
      }
    }
    ret += ')';

    return ret;
  }

  static parseFromPythonLiteral(text: string): any {
    if (text === 'True') {
      return true;
    } else if (text === 'False') {
      return false;
    } else if (text === 'None') {
      return null;
    } else if (text.charAt(0) == "'") {
      return text.substr(1, text.length - 2);
    } else {
      return JSON.parse(text);
    }
  }

  private static buildLiteral(value: any): string {
    if (typeof value === 'undefined' || value === null) {
      return 'None';
    }

    if (typeof value === 'boolean') {
      if (value) {
        return 'True';
      } else {
        return 'False';
      }
    }

    if (typeof value === 'number') {
      return JSON.stringify(value);
    }

    if (typeof value === 'string') {
      // TODO: The Python string is different from JSON string
      // It uses \xhh instead of \uxxxx
      return JSON.stringify(value);
    }

    if (Array.isArray(value)) {
      let ret = '[';
      for (let i = 0; i < value.length; i++) {
        if (i !== 0) {
          ret = ret + ',';
        }

        ret = ret + PythonCodeHelper.buildLiteral(value[i]);
      }

      return ret + ']';
    }

    return 'None';
  }
}

export class Util {
  static combineUrl(parent: string, child: string) {
    if (Util.isNullOrEmptyString(child)) {
      return parent;
    }

    if (parent.substr(parent.length - 1) === '/') {
      parent = parent.substr(0, parent.length - 1);
    }

    if (child.charAt(0) == '/') {
      child = child.substr(1);
    }

    return parent + '/' + child;
  }

  static isNullOrEmptyString(str: string): boolean {
    if (typeof str === 'undefined' || str === null) {
      return true;
    }

    return str.length == 0;
  }

  static uuid(): string {
    /**
     * http://www.ietf.org/rfc/rfc4122.txt
     */
    var s = [];
    var hexDigits = '0123456789abcdef';
    for (var i = 0; i < 32; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[12] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
    s[16] = hexDigits.substr((s[16] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01

    var uuid = s.join('');
    return uuid;
  }

  static log(text: string): void {
    const logger = log.getLogger('Jupyter');
    logger.info(text);
  }

  static logResult(text: string): void {
    const logger = log.getLogger('Jupyter');
    logger.info(text);
  }

  static logConsole(text: string): void {
    const logger = log.getLogger('Jupyter');
    logger.error(text);
    console.log(text);
  }
}
