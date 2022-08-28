import { Settings } from '../interfaces/settings.interface';
import { Cleaner } from '../cleaner';

export class ChromeHelpers {
  static getOptions(): Promise<Settings> {
    return chrome.storage.sync.get(['options', 'version', 'updatedOn']).then((result) => {
      return {
        ...Cleaner.defaultOptions,
        ...result.options,
        version: result.version,
        updatedOn: result.updatedOn,
      };
    });
  }

  static setOptions(options: Settings) {
    chrome.storage.sync.set({ options, version: Cleaner.version, updatedOn: new Date().getTime() });
  }
}
