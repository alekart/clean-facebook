import { Settings } from './interfaces/settings.interface';
import { ChromeHelpers } from './helpers/chrome-helpers.class';
import { version } from '../../package.json';

function getCheckboxesElements(): HTMLInputElement[] {
  const list: HTMLInputElement[] = [];
  const checkBoxes = document.querySelectorAll('input[type=checkbox]');
  checkBoxes?.forEach((chk: HTMLInputElement) => {
    list.push(chk);
  });
  return list;
}

function getOptions(checkBoxes: HTMLInputElement[]): Settings {
  return checkBoxes.reduce((accum: Record<any, any>, chk) => {
    accum[chk.name] = chk.checked;
    return accum;
  }, {}) as Settings;
}

function setCheckboxesValues(checkBoxes: HTMLInputElement[], settings: Settings) {
  const keys = Object.keys(settings);
  keys.forEach((key) => {
    const value = settings[key as keyof Settings];
    const checkbox = checkBoxes.find((chk) => chk.name === key);
    if (checkbox && typeof value === 'boolean') {
      checkbox.checked = value;
    }
  });
}

(function () {
  const checkBoxes = getCheckboxesElements();
  const mainOptions = checkBoxes.filter((chk) => chk.name !== 'theyLive');
  const theyLiveChk = checkBoxes.find((chk) => chk.name === 'theyLive');
  const versionContainer = document.querySelector('.version');
  if (versionContainer) {
    versionContainer.innerHTML = version;
  }

  ChromeHelpers.getOptions().then((settings) => {
    setCheckboxesValues(checkBoxes, settings || {});
  });

  checkBoxes.forEach((chk) => {
    chk.addEventListener('change', (event: MouseEvent) => {
      const target = event.target as HTMLInputElement;
      const box = target.name;
      const checked = target.checked;
      if (box === 'theyLive' && checked) {
        mainOptions.forEach((c) => c.checked = true);
      }
      if (box !== 'theyLive' && theyLiveChk.checked) {
        theyLiveChk.checked = false;
      }
      ChromeHelpers.setOptions(getOptions(checkBoxes));
    });
  });
})();
