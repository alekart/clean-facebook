import { i18n } from './i18n';
import { TheyLive } from './they-live.class';
import { Settings } from './interfaces/settings.interface';

export class Cleaner {
  readonly lang: string;
  readonly attributeName = 'data-cleanface';
  readonly checkedAttribute = 'data-cleanchecked';
  readonly theyLiveAttribute = 'data-theylive';
  readonly feed: HTMLElement;
  private feedObserver: MutationObserver;

  constructor(private settings: Settings) {
    this.lang = Cleaner.getDocumentLang();
    this.feed = document.querySelector('[role="feed"]');
    document.body.classList.add('cleanface');
    if (this.settings.theyLive) {
      // add .they-live class on body when "They Live" mode is enabled
      document.body.classList.add('they-live');
    }
  }

  // region Static Methods
  static getDocumentLang(): string {
    return document.documentElement.lang;
  }

  static findParentElementWithoutClass(element: HTMLElement): HTMLElement {
    let elem = element;
    if (!elem) {
      return null;
    }
    while (elem.classList.length) {
      elem = elem.parentElement;
    }
    return elem;
  }

  static getFeedBlock(element: HTMLElement): HTMLElement | null {
    return element?.closest('[role=feed] > div');
  }

  static isFeedElement(el: Element): boolean {
    return el.getAttribute('role') === 'feed';
  }

  static getAdBlock(element: Element): Element {
    let block = null;
    if (!element) {
      return null;
    }
    let parent = element;
    while (!Cleaner.isFeedElement(parent)) {
      block = parent;
      parent = parent.parentElement;
    }
    return block;
  }

  static doesItContainsAllWordLetters(word: string, letters: string): boolean {
    const wordLetters = word.split('');
    return wordLetters.every((letter) => letters.includes(letter));
  }

  static getElementByXpath(xpath: string): HTMLElement {
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue as HTMLElement;
  }

  // endregion Static Methods

  get sideSponsoredXPath(): string {
    return `//*[text()='${i18n('sponsored', this.lang)}' and not(@${this.checkedAttribute})]`;
  };

  get suggestionsXPath(): string {
    return `//*[text()='${i18n('suggestions', this.lang)}' and not(@${this.checkedAttribute})]`;
  };

  get reelsXPath(): string {
    return `//*[text()='${i18n('reels', this.lang)}' and not(@${this.checkedAttribute})]`;
  };

  get remove() {
    return {
      ads: () => this.removeSponsored(),
      suggestions: this.removeFeedElementByXpathFn(this.suggestionsXPath),
      sideSponsored: this.removeFeedElementByXpathFn(this.sideSponsoredXPath, null, false, 'side-clean-face'),
      watch: this.removeFeedElementByXpathFn(this.reelsXPath, TheyLive.watchWords),
    };
  }

  run() {
    this.clean(false);
    this.feedObserver = new MutationObserver(() => {
      this.clean();
    });

    this.feedObserver.observe(this.feed, { attributes: false, childList: true });
  }

  /**
   * Returns true if mutation observer is defined.
   */
  isRunning(): boolean {
    return !!this.feedObserver;
  }

  private clean(skipSide = true) {
    if (this.settings.sponsored) {
      this.remove.suggestions();
    }
    if (this.settings.videos) {
      this.remove.watch();
    }
    if (this.settings.sponsored) {
      this.remove.ads();
      // side sponsored post is removed only once
      if (!skipSide) {
        this.remove.sideSponsored();
      }
    }
  }

  /**
   * Removes a feed element by its XPATH.
   * Facebook feeds elements are generated and all looks the same except for
   * "Videos and reels" and "Suggested" (and side sponsored)  blocks that have explicit text title.
   * @param xpath XPath for the element selection (https://developer.mozilla.org/en-US/docs/Web/XPath)
   * @param words List of words that will be randomly displayed in They Live mode
   * @param feedBlock if the block is looked inside the feed flow (Default: true)
   * @param addClass additional class to add on matching block
   */
  private removeFeedElementByXpathFn(xpath: string, words?: string[], feedBlock = true, addClass = ''): () => void {
    return () => {
      const element = Cleaner.getElementByXpath(xpath);
      if (element) {
        element.setAttribute(this.checkedAttribute, '');
        const block = feedBlock
          ? Cleaner.getFeedBlock(element)
          : Cleaner.findParentElementWithoutClass(element);
        if (block) {
          if (addClass) {
            block.classList.add(addClass);
          }
          block.setAttribute(this.attributeName, '');
          block.setAttribute(this.theyLiveAttribute, TheyLive.word(words));
        }
      }
    };
  }

  /**
   * Feed sponsored blocks are identical to the normal posts and are hard to detect.
   * The only way I found is to check the "time" link under the title, and it's not that simple...
   * (see: isAdLink method description)
   */
  private removeSponsored(): void {
    let adLinks = this.getFeedLinks();
    adLinks.forEach((element) => {
      const block = Cleaner.getAdBlock(element);
      if (block) {
        block.setAttribute(this.attributeName, '');
        block.setAttribute(this.theyLiveAttribute, TheyLive.word());
      }
    });
  }

  /**
   * Retrieve all links inside feed blocks and keep only those that are "Sponsored".
   * These links will allow to get the parent sponsored feed blocks.
   *
   * Tu avoid running heavy isAdLink check every time the feed is updated, links are marked
   * as checked via an attribute.
   */
  private getFeedLinks(): Element[] {
    const selector = `[role="link"]:not([${this.checkedAttribute}])`;
    let links = this.feed.querySelectorAll(selector);
    const elements: Element[] = [];
    links.forEach((element) => {
      element.setAttribute(this.checkedAttribute, '');
      elements.push(element);
    });
    return elements.filter((l) => this.isAdLink(l));
  }

  /**
   * Complex and a bit heavy way to detect Sponsored posts in facebook feed.
   * 1. get all the links present in the Feed center part
   * 2. get 'text' element that is nested in the link 'span > span > div'
   * 3. get all divs inside the "text" element
   *  It contains lots of elements with one character inside and even if is not sponsored post
   *  it contains all letters that compose the word "Sponsored" but it is not visible, they are
   *  hidden with top position and parent hidden overflow
   * 4. get all elements that are visible
   * 5. combine all characters from those elements
   * 6. check if the word "Sponsored" is present in the visible characters
   */
  private isAdLink(link: Element): boolean {
    const href = link.getAttribute('href');
    if (/^\/ads\//.test(href)) {
      return true;
    }
    const innerSpan = link.querySelector('span > span > div');
    if (innerSpan) {
      const divs = innerSpan.querySelectorAll('div');
      const elements: Element[] = [];
      divs.forEach((d) => elements.push(d));
      const elementsTexts = elements.reduce((accum, span) => {
        const top = parseInt(window.getComputedStyle(span, null).top, 10);
        if (top > 0) {
          return accum;
        }
        return `${accum}${span.innerHTML}`;
      }, '');
      return Cleaner.doesItContainsAllWordLetters(i18n('sponsored', this.lang), elementsTexts);
    }
    return false;
  }
}
