import { Cleaner } from './cleaner';
import { ChromeHelpers } from './helpers/chrome-helpers.class';
import { Settings } from './interfaces/settings.interface';

let cleaner: Cleaner;
let retries = 0;

function createCleaner(settings: Settings) {
  try {
    cleaner = new Cleaner(settings);
    cleaner.run();
    console.log('Facebook Cleaner start');
  } catch (e) {
    if(retries < 5) {
      retries += 1;
      setTimeout(() => {
        console.log(`Trying to run Clean Facebook. Retry: ${retries}`);
        createCleaner(settings);
      }, 500);
    } else {
      console.error(`Clean Facebook could not run after ${retries} retries. Aborting.`);
    }
  }
}

window.addEventListener('DOMContentLoaded', (event) => {
  async function start() {
    const settings = await ChromeHelpers.getOptions();
    createCleaner(settings)
  }
  start();
});
