'use strict';

import './popup.css';

(function () {
  // We will make use of Storage API to get and store `count` value
  // More information on Storage API can we found at
  // https://developer.chrome.com/extensions/storage

  // To get storage access, we have to mention it in `permissions` property of manifest.json file
  // More information on Permissions can we found at
  // https://developer.chrome.com/extensions/declare_permissions

  function getOptions() {
    return [...checkBoxes].reduce((accum, chk) => {
      accum[chk.name] = chk.checked;
      return accum;
    }, {});
  }

  function storeOptions() {
    chrome.storage.sync.set({options: getOptions()});
  }

  const checkBoxes = document.querySelectorAll('input[type=checkbox]');
  const mainOptions = [...checkBoxes].filter((chk) => chk.name !== 'theyLive');
  const theyLiveChk = [...checkBoxes].find((chk) => chk.name === 'theyLive');

  function setCheckboxes(options) {
    for (const [key, value] of Object.entries(options)) {
      const checkbox = [...checkBoxes].find((chk) => chk.name === key);
      checkbox.checked = value;
    }
  }

  chrome.storage.sync.get(['options'], (result) => {
    setCheckboxes(result.options);
  });

  checkBoxes.forEach((chk) => {
    chk.addEventListener('change', (event) => {
      console.log('changed');
      const box = event.target.name;
      const checked = event.target.checked;
      if (box === 'theyLive' && checked) {
        mainOptions.forEach((c) => c.checked = true);
      }
      if (box !== 'theyLive' && theyLiveChk.checked) {
        theyLiveChk.checked = false;
      }
      storeOptions();
    });
  });
})();
