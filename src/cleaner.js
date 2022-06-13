import { i18n } from './i18n';
import { theyLive, watchWords } from './they-live.ts';
import { addStyle } from './add-style';

const lang = document.documentElement.lang;
const debug = false;

function log(...attrs) {
  if (debug) {
    console.log(...attrs);
  }
}

function isFeedElement(el) {
  return el.getAttribute('role') === 'feed';
}

function getFeedBlock(elem) {
  let block = null;
  if (!elem) {
    return null;
  }
  let parent = elem;
  while (!isFeedElement(parent)) {
    block = parent;
    parent = parent.parentElement;
  }
  return block;
}

export function clean(options) {
  addStyle(options.theyLive);
  const attributeName = 'data-cleanface';
  const checkedAttribute = 'data-cleanchecked';
  const theyLiveAttribute = 'data-theylive';
  const feed = document.querySelector('[role="feed"]');

  const xpath = [
    `//*[text()='${i18n('sponsored', lang)}' and not(@${checkedAttribute})]`,
    `//*[text()='${i18n('suggestions', lang)}' and not(@${checkedAttribute})]`,
    `//*[text()='${i18n('reels', lang)}' and not(@${checkedAttribute})]`,
  ];

  function getByXpath(xpath) {
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }

  function findElementAndItsParent(elem) {
    if (!elem) {
      return null;
    }
    while (elem.classList.length) {
      elem = elem.parentElement;
    }
    return elem;
  }

  function removeSideSponsored() {
    if(!options.sponsored){
      return;
    }
    const element = getByXpath(xpath[0]);
    if (!element) {
      return;
    }
    element.setAttribute(checkedAttribute, '');
    const block = findElementAndItsParent(element);
    if (block) {
      block.setAttribute(attributeName, '');
      block.setAttribute(theyLiveAttribute, theyLive());
      block.classList.add('side-clean-face');
      log('Side sponsored ad removed', block);
    }
  }

  function removeSuggestions() {
    if(!options.suggested){
      return;
    }
    const element = getByXpath(xpath[1]);
    if (!element) {
      return;
    }
    element.setAttribute(checkedAttribute, '');
    const block = getFeedBlock(element);
    if (block) {
      block.setAttribute(attributeName, '');
      block.setAttribute(theyLiveAttribute, theyLive());
      log('Suggestion removed', block);
    }
  }

  function removeSponsored() {
    if(!options.sponsored){
      return;
    }
    let adLinks = getFeedLinks();
    adLinks.forEach((l) => {
      const block = getAdBlock(l);
      if (block) {
        block.setAttribute(attributeName, '');
        block.setAttribute(theyLiveAttribute, theyLive());
        log('Feed sponsorised ad removed', block);
      }
    });
  }

  function removeReelsAndVideos() {
    if(!options.reels){
      return;
    }
    const element = getByXpath(xpath[2]);
    if (element) {
      const block = getFeedBlock(element);
      if (block) {
        block.setAttribute(attributeName, '');
        block.setAttribute(theyLiveAttribute, theyLive(watchWords));
        log('Reel removed', element);
      }
    }
  }

  function getFeedLinks() {
    const selector = `[role="link"]:not([${checkedAttribute}])`;
    let links = feed.querySelectorAll(selector);
    links = [...links];
    links.forEach((l) => {
      l.setAttribute(checkedAttribute, '');
    });
    return links.filter((l) => isAdLink(l));
  }

  function isAdLink(link) {
    const href = link.getAttribute('href');
    if (/^\/ads\//.test(href)) {
      return true;
    }
    const innerSpan = link.querySelector('span > span > span');
    if (innerSpan) {
      const spans = innerSpan.querySelectorAll('span');
      const spansText = [...spans].reduce((accum, span) => {
        const top = parseInt(window.getComputedStyle(span, null).top, 10);
        if(top > 0){
          return accum;
        }
        return `${accum}${span.innerHTML}`;
      }, '');
      return doesItContainsAllWordLetters(i18n('sponsored', lang), spansText);
    }
    return false;
  }

  function doesItContainsAllWordLetters(word, letters) {
    const wordLetters = word.split('');
    return wordLetters.every((letter) => letters.includes(letter));
  }

  function getAdBlock(element) {
    let block = null;
    if (!element) {
      return null;
    }
    let parent = element;
    while (!isFeedElement(parent)) {
      block = parent;
      parent = parent.parentElement;
    }
    return block;
  }

  const config = {attributes: false, childList: true};

  const observer = new MutationObserver(() => {
    removeSuggestions();
    removeSponsored();
    removeReelsAndVideos();
  });

  removeSideSponsored();
  removeSuggestions();
  removeSponsored();
  removeReelsAndVideos();

  observer.observe(feed, config);
}