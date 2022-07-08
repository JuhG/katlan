export interface Item {
  id: number;
  title: string;
  time: undefined | { name: string };
  village: undefined | { name: Location };
  labels: undefined | { name: Program }[];
}

export enum Location {
  nagyharsany = "NAGYHARSÁNY",
  beremend = "BEREMEND",
  villanykovesd = "VILLÁNYKÖVESD",
  mokos = "MOKOS SZÍNHÁZ",
  vylyan = "VYLYAN TERASZ",
}

export enum Program {
  szinhaz = "SZÍNHÁZ",
  koncert = "KONCERT",
  irodalom = "IRODALOM",
  csaladi = "CSALÁDI",
  cirkusz = "CIRKUSZ",
  workshop = "WORKSHOP",
  tanc = "TÁNC",
  diszvendeg = "DÍSZVENDÉG",
  kiallitas = "KIÁLLÍTÁS",
  beszelgetes = "BESZÉLGETÉS",
  film = "FILM",
}

export enum Range {
  all = "all",
  three = "three",
  today = "today",
  tomorrow = "tomorrow",
}
