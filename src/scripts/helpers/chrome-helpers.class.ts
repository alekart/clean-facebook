import { Settings } from '../interfaces/settings.interface';
import { Cleaner } from '../cleaner';

export class ChromeHelpers {
  static getOptions(): Promise<Settings> {
    return chrome.storage.sync.get(['options', 'version', 'updatedOn', 'language']).then((result) => {
      return {
        ...Cleaner.defaultOptions,
        ...result.options,
        language: result.language,
        version: result.version,
        updatedOn: result.updatedOn,
      };
    });
  }

  static setOptions(options: Settings) {
    chrome.storage.sync.set({
      options,
      version: Cleaner.version,
      updatedOn: new Date().getTime(),
    });
  }

  static setLang(lang?: string) {
    chrome.storage.sync.set({
      language: lang || 'en',
      updatedOn: new Date().getTime(),
    });
  }
}
