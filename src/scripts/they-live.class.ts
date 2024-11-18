export class TheyLive {
  static adwords = ['consume', 'conform', 'no thoughts', 'watch', 'no imagination', 'buy'];

  static random(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  static word(list: string[] = TheyLive.adwords): string {
    const index = list?.length > 1 ? TheyLive.random(0, list.length) : 0;
    return list?.[index] || TheyLive.adwords[0];
  }
}
