import { driverManager } from './driver-manager';

export type Decorator =  (proto: any) => void;

function getName({ capabilities, name }: any) {
  if (name) {
    return name;
  }
  if (capabilities && capabilities.browserName) {
    return capabilities.browserName;
  }
  return 'wdio_unknown';
}

export class WebDriverIOLauncher {
  // karma props
  name: string;
  id: number;

  constructor(
    args: any,
    logger: any,
    config: any,
    baseLauncherDecorator: Decorator,
    captureTimeoutLauncherDecorator: Decorator,
    retryLauncherDecorator: Decorator,
  ) {
    baseLauncherDecorator(this);
    captureTimeoutLauncherDecorator(this);
    retryLauncherDecorator(this);

    this.name = getName(args);

    driverManager.init(this.id, args, config.wdioLauncher);

    const log = logger.create('WebDriverIOLauncher');

    (this as any).on('start', async (pageUrl: string) => {
      try {
        log.debug('Opening "%s" on the selenium client', pageUrl);
        const driver = await driverManager.get(this.id);
        await driver.url(pageUrl);
      } catch (e) {
        log.error(e);
        (this as any)._done('failure');
      }
    });

    (this as any).on('kill', async (doneFn: () => void) => {
      try {
        const deleted = await driverManager.del(this.id);
        log.debug('driver deleted? %s', deleted);
      } catch (e) {
        log.error('Could not quit the Saucelabs selenium connection. Failure message:');
        log.error(e);
      }
      doneFn();
    });
  }
}

