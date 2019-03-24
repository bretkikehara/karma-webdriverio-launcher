import { parseRemoteConfig, ReporterConfig, parseReporterConfig } from './config';
import { parseCommand } from './commands';

// NOTE: need to use requires b/c webdriverio typescripts definitions are broken.
var { remote } = require('webdriverio');

const errDriverManagerNotAvailable = new Error('driver manager not available');
const errDriverNotAvailable = new Error('driver not available');

export type Driver = any;
export type BrowserID = number|string;

function getBrowserID(browserID: BrowserID): string {
  return '' + browserID;
}

class DriverManager {
  private DRS: { [key: string]: Promise<Driver> } = {};

  private cfg: ReporterConfig;

  init(browserID: BrowserID, args: any, config?: any) {
    if (!this.cfg) {
      this.cfg = parseReporterConfig(config);
    }
    if (this.DRS) {
      this.DRS[getBrowserID(browserID)] = remote(parseRemoteConfig(args));
    }
  }

  del(browserID: BrowserID): Promise<boolean> {
    if (!this.DRS) {
      return Promise.reject(errDriverManagerNotAvailable);
    }
    return this.get(browserID).then((driver: Driver) => {
      return driver.deleteSession().then(() => {
        (this.DRS[getBrowserID(browserID)] as any) = undefined;
        return true;
      }, () => {
        return false;
      });
    });
  }

  get(browserID: BrowserID): Promise<Driver> {
    if (!this.DRS) {
      return Promise.reject(errDriverManagerNotAvailable);
    }
    const driver = this.DRS[getBrowserID(browserID)];
    if (!driver) {
      return Promise.reject(errDriverNotAvailable);
    }
    return driver;
  }

  execCommand(browserID: BrowserID, payload: string): Promise<any> {
    return this.get(browserID).then((driver: Driver) => {
      const cmd = parseCommand(payload);
      if (cmd.valid) {
        try {
          if (this.cfg[cmd.action]) {
            return Promise.resolve(this.cfg[cmd.action](driver, cmd));
          }
        } catch(e) {
          return Promise.reject(e);
        }
        return Promise.reject(new Error('action not defined'));
      }
      return Promise.reject(new Error('action was invalid'));
    });
  }
}

export const driverManager = new DriverManager();
