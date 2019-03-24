karma-webdriverio-launcher
============================================================

# Minimun config

There are 3 configs that power this tool: `wdioLauncher`, `middleware`, and `customLaunchers`.

* `wdioLauncher` defines the hooks to manipulate a test. This will be run once per browser instance.
* `middleware` enables the tests to signify which hook to run.
* `customLaunchers` defines the browser configuration.

```js
// karma.conf.js
module.exports = function (config) {
  config.set({
    frameworks: ['mocha', 'chai'],
    // NOTE: This is how the tests signifies to karma server to run the custom commands.
    middleware: ['webdriverio'],
    browsers: ['selenium_firefox', 'selenium_chrome'],
    // NOTE: Defines the custom selenium browsers!
    customLaunchers: {
      selenium_firefox: {
        // webdriverio base launcher
        base: 'webdriverio',
        // user generated name
        name: 'wd_firefox',
        // selenium capabilties config
        capabilities: {
          browserName: 'firefox',
        }
      },
      selenium_chrome: {
        // webdriverio base launcher
        base: 'webdriverio',
        // user generated name
        name: 'wd_chrome',
        // selenium capabilties config
        capabilities: {
          browserName: 'chrome',
        },
      },
    },
    files: [
      // your test files
    ],
    // NOTE: Defines the custom commands to run!
    wdioLauncher: {
      screenshot(driver, { meta }) {
        // dumps screenshots in the ./tmp/screenshots path.
        return driver.saveScreenshot('./tmp/screenshots/' + meta + '.png');
      },
    },
  });
};
```

### Define a custom job

In the `wdioLauncher` config, define a function. The

* `driver` WDIO browser instance.
* `cmd` The command object
    * `raw` The raw command
    * `typ` should be CMD
    * `action` the action that is running.
    * `meta` the data that was sent.

```
wdioLauncher: {
  screenshotXYZ(driver, cmd) {
    // dumps screenshots in the ./tmp/screenshots path.
    return driver.saveScreenshot('./tmp/screenshots/' + cmd.meta + '.png');
  },
}
```

### Run a custom job

```
import { execCallback, execPromise } from '@bretkikehara/karma-webdriverio-launcher/dist/browser';

describe('mytest', () => {
  it('add element', (done) => {
    var div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.background = 'red';
    div.style.height = '20px';
    div.style.width = '20px';
    document.body.appendChild(div);

    var action = 'screenshotXYZ';
    var meta = 'my-picture-cb';
    execCallback(action, meta, done);
  });

  it('add element', async (done) => {
    var div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.background = 'red';
    div.style.height = '20px';
    div.style.width = '20px';
    document.body.appendChild(div);

    var action = 'screenshotXYZ';
    var meta = 'my-picture-pr';
    await execPromise(action, meta);
  });
});
```
