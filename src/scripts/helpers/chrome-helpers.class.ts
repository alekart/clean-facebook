import { Settings } from '../interfaces/settings.interface';

export class ChromeHelpers {
  static getOptions(): Promise<Settings> {
    return chrome.storage.sync.get(['options']).then((result) => {
      return result.options;
    });
  }

  static setOptions(options: Settings) {
    chrome.storage.sync.set({ options });
  }
}
