import { TheyLive } from './they-live.class';
import { Settings } from './interfaces/settings.interface';
import { version } from '../manifest.json';
import { getChecks } from './checks';

export class Cleaner {
  static version = version;
  static defaultOptions: Settings = {
    sponsored: true,
    suggestions: true,
    videos: true,
    theyLive: true,
    language: 'en',
  };
  readonly lang: string;
  readonly attributeName = 'data-cleanface';
  /**
   * Feed section, containing the FB posts feed
   */
  readonly feedContainer: HTMLElement;
  private feedObserver: MutationObserver;
  private feedChecks: RegExp[] = [];
  private counter = 0;
  private legitCount = 0;
  private badge?: HTMLElement;

  constructor(private settings: Settings) {
    this.lang = settings.language || 'en';
    this.feedContainer = document.querySelector('[role="feed"] > div');
    this.feedChecks = getChecks(this.lang, this.settings);

    if (!this.feedContainer) {
      throw new Error(`Clean Facebook can't run without feed container`);
    }

    document.body.classList.add('cleanface');
    // add .they-live class on body when "They Live" mode is enabled
    if (this.settings.theyLive) {
      document.body.classList.add('they-live');
    }

    this.setBadge();
  }

  run() {
    const items: NodeListOf<HTMLElement> = this.feedContainer?.querySelectorAll('[data-pagelet]');
    if (!items?.length) {
      throw new Error(`Clean Facebook could not find any feed items`);
    }
    items?.forEach((item) => this.clean(item));
    if (this.settings.sponsored) {
      this.removeSideSponsored();
    }

    try {
      this.feedObserver = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
          // Check if the mutation has added nodes
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                // Clean the element
                this.clean(node as HTMLElement);
              }
            });
          }
        }
      });

      this.feedObserver.observe(this.feedContainer, { attributes: false, childList: true });
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Adds a counter badge if it does not exist and updates its count.
   */
  private setBadge() {
    if (!this.badge) {
      this.badge = document.createElement('div');
      this.badge.classList.add('cleanface-badge');
      document.body.appendChild(this.badge);
    }
    this.badge.setAttribute('title', `Clean Facebook: displayed ${this.legitCount}, hidden ${this.counter}`);
    this.badge.innerHTML = `${this.counter}`;
  }

  private clean(element: HTMLElement) {
    if (element) {
      if (this.isUnwantedContent(element)) {
        this.addClassAndAttribute(element);
        this.counter += 1;
      } else if (element.textContent) {
        this.legitCount += 1;
      }
      this.setBadge();
    }
  }

  private addClassAndAttribute(element: HTMLElement) {
    element.classList.add('cleanface');
    element.setAttribute(this.attributeName, TheyLive.word());
  }

  private removeSideSponsored(): void {
    const side: HTMLElement | undefined = document.querySelector('[data-pagelet="RightRail"] > div');
    if (side) {
      this.addClassAndAttribute(side);
    }
  }

  private isUnwantedContent(element: HTMLElement): boolean {
    const textContent = element.textContent;
    if (!textContent) {
      return false;
    }
    return this.feedChecks.some((regex) => !!regex.exec(textContent));
  }
}
