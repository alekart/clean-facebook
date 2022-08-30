import { Cleaner } from './cleaner';
import { ChromeHelpers } from './helpers/chrome-helpers.class';

let cleaner: Cleaner;
let retries = 0;

function prepareAndRunCleaner() {
  ChromeHelpers.getOptions().then((settings) => {
    cleaner = new Cleaner(settings);
    cleaner.run();
    if (cleaner?.isRunning()) {
      console.log('Clean Facebook is running.');
    }
  });
}

window.addEventListener('DOMContentLoaded', (event) => {
  // Initial run on dom ready
  prepareAndRunCleaner();
  // Every 500ms check if cleaner is running, if it is remove interval otherwise run it again
  const interval = setInterval(() => {
    if (cleaner?.isRunning() || retries === 5) {
      if(retries === 5){
        console.log(`Clean Facebook could not run after ${retries} retries. Aborting.`);
      }
      clearInterval(interval);
      return;
    }
    retries += 1;
    prepareAndRunCleaner();
    console.log(`Trying to run Clean Facebook. Retry: ${retries}`);
  }, 500);
});
