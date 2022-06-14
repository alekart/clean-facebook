export class ChromeHelpers {
  static getOptions(): Promise<any> {
    return chrome.storage.sync.get(['options']).then((result) => {
      return result.options;
    });
  }

  static setOptions(options: any) {
    chrome.storage.sync.set({ options });
  }
}
