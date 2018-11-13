import Assert from './util/Assert';
import ObjectStore from './util/ObjectStore';
import { RuntimeState } from './RuntimeState';
import IRuntime from './IRuntime';
import uuidV4 from 'uuid/v4';
import { serverUrl } from '../../../environment';

interface IPromiseObject {
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}

export default class WebRuntime implements IRuntime {
  private callBackList: ObjectStore<IPromiseObject>;
  private creationTime: number;
  private messageHandler: any;
  private id: string;
  private iframe: HTMLIFrameElement;
  private origin: string;
  private state: RuntimeState;
  private lastUpdatedTime: number;

  static async createRuntimeInstance(
    scriptId: string,
    scriptCode: string,
    lastUpdatedTime: number,
  ): Promise<WebRuntime> {
    return new Promise<WebRuntime>((resolve, reject) => {
      const runtime: WebRuntime = new WebRuntime(scriptId, lastUpdatedTime);
      const eventId = uuidV4();
      runtime.callBackList.create(eventId, { resolve, reject });

      runtime.iframe.onload = () => {
        runtime.iframe.contentWindow!.postMessage(
          { eventId, eventType: 'loadScriptCode', scriptCode },
          runtime.origin,
        );
      };

      document.body.appendChild(runtime.iframe);
    });
  }

  private constructor(scriptId: string, lastUpdatedTime: number) {
    this.state = RuntimeState.Ready;
    this.messageHandler = this.handleMessage.bind(this);
    window.addEventListener('message', this.messageHandler, false);
    this.callBackList = new ObjectStore<IPromiseObject>();
    this.id = scriptId;
    this.creationTime = Date.now();
    this.origin = serverUrl;
    this.lastUpdatedTime = lastUpdatedTime;
    this.iframe = document.createElement('iframe');
    this.iframe.setAttribute('id', scriptId);
    this.iframe.src = `${this.origin}/iframe.html`;
    this.iframe.style.display = 'none';
  }

  getId(): string {
    return this.id;
  }
  getCreationTime(): number {
    return this.creationTime;
  }

  getLastUpdatedTime(): number {
    return this.lastUpdatedTime;
  }

  async getState(): Promise<RuntimeState> {
    return new Promise<RuntimeState>(resolve => {
      resolve(this.state);
    });
  }

  async executeFunction(functionName: string, functionArgs: any[]): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      Assert.True(this.iframe.parentNode != null, 'invaid iframe, no parent node found');
      Assert.True(
        this.iframe.contentWindow != null,
        'invaid iframe, no content window found',
      );
      const eventId = uuidV4();
      this.callBackList.create(eventId, { resolve, reject });
      this.state = RuntimeState.Executing;

      this.iframe.contentWindow!.postMessage(
        {
          eventId,
          eventType: 'execute',
          functionName,
          functionArgs,
        },
        this.origin,
      );
    });
  }

  private handleMessage(event: any) {
    if (event.origin === this.origin) {
      if (event.data.eventType === 'scriptCodeLoaded') {
        this.handlePromiseResolving(event, this);
      }

      if (event.data.eventType === 'executionFinished') {
        this.handlePromiseResolving(event, event.data.message.result);
      }

      if (event.data.eventType === 'officeJsMessage') {
        (window as any).OSF.DDA.RichApi.executeRichApiRequestAsync(
          event.data.message,
          (result: any) => {
            event.source.postMessage(
              { eventType: 'officeJsMessageResponse', id: event.data.id, result },
              event.origin,
            );
          },
        );
      }
    }
  }

  private handlePromiseResolving(event: any, value: any) {
    const promiseObject = this.callBackList.read(event.data.eventId);
    this.callBackList.delete(event.data.eventId);
    if (event.data.message.status === 'Success') {
      // TODO: Real state check, as there could be more executions queued.
      this.state = RuntimeState.Ready;
      promiseObject.resolve(value);
    } else {
      this.state = RuntimeState.Ready; // TODO: We are not sure if the runtime is alive and green after the failure, so might require to do an extra check.
      promiseObject.reject(
        `Execution error on script ${event.data.runtimeId}: ${
          event.data.message.statusMessage
        }`,
      );
    }
  }

  async terminate(): Promise<void> {
    return new Promise<void>(resolve => {
      window.removeEventListener('message', this.messageHandler);
      if (this.iframe.parentNode) {
        this.iframe.parentNode.removeChild(this.iframe);
      }
      resolve();
    });
  }
}
