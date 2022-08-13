import { Cleaner } from './cleaner';
import { ChromeHelpers } from './helpers/chrome-helpers.class';

let cleaner: Cleaner;

function prepareAndRunCleaner() {
  ChromeHelpers.getOptions().then((settings) => {
    cleaner = new Cleaner(settings);
    cleaner.run();
    if (cleaner?.isRunning()) {
      console.log('CleanFace is running.');
    }
  });
}

window.addEventListener('DOMContentLoaded', (event) => {
  // Initial run on dom ready
  prepareAndRunCleaner();
  // Every 500ms check if cleaner is running, if it is remove interval otherwise run it again
  const interval = setInterval(() => {
    if (cleaner?.isRunning()) {
      clearInterval(interval);
      return;
    }
    console.log('Run CleanFace.');
    prepareAndRunCleaner();
  }, 500);
});
