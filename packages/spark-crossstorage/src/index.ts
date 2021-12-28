import {handleGetGuuid, handleGetUpdateUrl} from "./utils";
import { parse } from 'query-string';
import WebStorageCache from "web-storage-cache";


function sparkCrossClient(url: string, params: Record<string, any>, timeout: number = 2000) {
    const uuid = handleGetGuuid()
    const sendUrl = handleGetUpdateUrl(url, uuid)
    const param = Object.assign(params, {uuid: uuid})
    let windowObjectReference = window.open(sendUrl);
    setTimeout(() => {
        windowObjectReference?.postMessage(
            {
                target: 'connect',
                message: param,
            }, sendUrl);
    }, timeout)
}

class SparkCrossServer {
    private _ageingStorage: Record<string, any>;

    public _promise: (fn) => any;

    public _timeout: number;

    public _ageingStroageTimeout: number;

    public _connectId: string[] | string | null;

    public _listenerCbk: (message) => void;

    public listeners: unknown[];

    public this: any

    constructor(options: { timeout: number, localStroageTimeout: number }) {
        this._promise = fn => new Promise(fn);
        this._ageingStorage = new WebStorageCache();
        this._timeout = options.timeout || 3000;
        this._listenerCbk = () => {
        };
        this._ageingStroageTimeout = options.localStroageTimeout || 24 * 60;
        this._connectId = parse(window.location.search).sparkCrossId;
        this.listeners = [];
        this._ageingStorage.deleteAllExpires();
    }

    init() {
        this._listenerCbk = ({data}) => {
            if (!(data.message && data.message.uuid)) return false;
            if (data.message.uuid === this._connectId && data.message) {
                this._ageingStorage.set(`${data.message.uuid}`, data.message, this._ageingStroageTimeout);
                this.emit('connectSuccess', data.message);
            }
            return false;
        };
        if (window.addEventListener) {
            window.addEventListener('message', this._listenerCbk, false);
        } else {
            //@ts-ignore
            window.attachEvent('onmessage', this._listenerCbk);
        }
    }

    on(type: string, cb: (data: Record<string, any>) => void) {
        if (!this.listeners[type]) {
            this.listeners[type] = [];
        }
        this.listeners[type].push(cb);
    }

    emit(type: string, ...args: Record<string, any>[]) {
        if (this.listeners[type]) {
            this.listeners[type].forEach(cb => {
                cb(...args);
            });
        }
    }

    off(type: string, cb: (data) => Record<string, any>) {
        if (this.listeners[type]) {
            const targetIndex = this.listeners[type].findIndex(item => item === cb);
            if (targetIndex !== -1) {
                this.listeners[type].splice(targetIndex, 1);
            }
            if (this.listeners[type].length === 0) {
                delete this.listeners[type];
            }
        }
    }

    onListen() {
        this.init();
        if (!this._connectId) return Promise.reject(new Error('connectId is required'));
        const timeoutPr = this._promise((_resolve, reject) => {
            setTimeout(() => {
                reject('connect error');
            }, this._timeout);
        });
        const messagePr = this._promise((resolve) => {
            this.on('connectSuccess', data => {
                resolve(data);
            });
        });
        return Promise.race([timeoutPr, messagePr]);
    }

    get() {
        return this._ageingStorage.get(this._connectId);
    }

    delete() {
        return this._ageingStorage.delete(this._connectId);
    }
}

export {
    sparkCrossClient,
    SparkCrossServer,
}
