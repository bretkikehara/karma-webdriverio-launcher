import { CommandPayload } from './commands';

declare var window: any;

function createCommand(action: string, meta: string): CommandPayload {
  return JSON.stringify({
    typ: 'CMD',
    action,
    meta,
  });
}

export function execCallback(action: string, meta: string, done: (err?: Error) => void) {
  const search = window.top.location.search;
  if (!search) {
    done(new Error('BrowserID not found'));
    return;
  }
  const xhr = new window.XMLHttpRequest();
  xhr.open('GET', '/exec' + search + '&msg=' + encodeURIComponent(createCommand(action, meta)));
  xhr.onload = () => {
    done();
  };
  xhr.onerror = () => {
    done(new Error('Command execution failed'));
  };
  xhr.send();
}

export function execPromise(action: string, meta: string): Promise<any> {
  return new Promise((resolve: () => void, reject: (err: Error) => void) => {
    execCallback(action, meta, (err?: Error) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
