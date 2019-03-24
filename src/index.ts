import { WebDriverIOLauncher } from './launcher';
import { middleware } from './middleware';

module.exports = {
  'launcher:webdriverio': ['type', WebDriverIOLauncher],
  'middleware:webdriverio': ['value', middleware],
};
