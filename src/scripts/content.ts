import { Cleaner } from './cleaner';
import { ChromeHelpers } from './helpers/chrome-helpers.class';

(() => {
  ChromeHelpers.getOptions().then((settings) => {
    const cleaner = new Cleaner(settings);
    cleaner.run();
  });
})();
