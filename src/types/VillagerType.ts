export type VillagerType = {
  'name': string,
  'url': string,
  'alt_name': string,
  'title_color': string,
  'text_color': string,
  'id': string,
  'image_url': string,
  'species': string,
  'personality': string,
  'gender': string,
  'birthday_month': string,
  'birthday_day': string,
  'sign': string,
  'quote': string,
  'phrase': string,
  'clothing': string,
  'islander': boolean,
  'debut': string,
  'prev_phrases': string[],
  'appearances': string[]
}

export type VillagerStatsType = {
  id: string,
  name: string,
  count: number
}

export type GameStatsType = {
  highScore: number;
  gamesFinished: number;
  gamesPlayed: number;
  villagers: VillagerStatsType[];
}