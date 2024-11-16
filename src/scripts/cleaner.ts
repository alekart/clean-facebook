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
  };
  readonly lang: string;
  readonly attributeName = 'data-cleanface';
  /**
   * Feed section, containing the FB posts feed
   */
  readonly feedContainer: HTMLElement;
  private feedObserver: MutationObserver;
  private feedChecks: RegExp[] = [];

  constructor(private settings: Settings) {
    this.lang = settings.language || 'en';
    this.feedContainer = document.querySelector('[role="feed"] > div');
    this.feedChecks = getChecks(this.lang, this.settings);

    document.body.classList.add('cleanface');
    // add .they-live class on body when "They Live" mode is enabled
    if (this.settings.theyLive) {
      document.body.classList.add('they-live');
    }
  }

  run() {
    const items: NodeListOf<HTMLElement>  = this.feedContainer.querySelectorAll('[data-pagelet]');
    items?.forEach((item) => this.clean(item));
    if(this.settings.sponsored) {
      this.removeSideSponsored();
    }
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
  }

  /**
   * Returns true if mutation observer is defined.
   */
  isRunning(): boolean {
    return !!this.feedObserver;
  }

  private clean(element: HTMLElement) {
    if(element && this.isUnwantedContent(element)) {
      this.addClassAndAttribute(element)
    }
  }

  private addClassAndAttribute(element: HTMLElement) {
    element.classList.add('cleanface');
    element.setAttribute(this.attributeName, TheyLive.word());
  }

  private removeSideSponsored(): void {
    const side: HTMLElement | undefined = document.querySelector('[data-pagelet="RightRail"] > div');
    if(side) {
      this.addClassAndAttribute(side);
    }
  }

  private isUnwantedContent(element: HTMLElement): boolean {
    const textContent = element.textContent;
    return this.feedChecks.some((regex) => regex.test(textContent));
  }
}
