export class TheyLive {
  static adwords = ['buy', 'consume', 'no independent thoughts'];
  static watchWords = ['watch', 'no imagination'];

  static random(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  static word(list: string[] = TheyLive.adwords): string {
    const index = list?.length > 1 ? TheyLive.random(0, list.length - 1) : 0;
    return list?.[index] || TheyLive.adwords[0];
  }
}
