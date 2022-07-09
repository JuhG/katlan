export interface Item {
  title: string;
  description: string;
  duration: number;
  time: undefined | { name: string };
  village: undefined | { name: Village };
  stage: undefined | { name: Stage };
  labels: undefined | { name: Topic }[];
  // extra
  id: number;
  relativeDateInMinutes: number;
}

export enum Village {
  nagyharsany = "NAGYHARSÁNY",
  beremend = "BEREMEND",
  villanykovesd = "VILLÁNYKÖVESD",
  mokos = "MOKOS SZÍNHÁZ",
  vylyan = "VYLYAN TERASZ",
}

export enum Stage {
  // NAGYHARSÁNY
  templom = "TEMPLOM",
  falukozpont_arokpart_bar = "FALUKÖZPONT - ÁROKPART BÁR",
  tornaterem = "TORNATEREM",
  narancsliget = "NARANCSLIGET",
  pecsi_bolcsesz_udvar_aralica_kert = "Pécsi Bölcsész Udvar - Aralica Kert",
  offlajn_rezervatum_a_helytorteneti_múzeum_mogott = "OFFLÁJN REZERVÁTUM - A HELYTÖRTÉNETI MÚZEUM MÖGÖTT",
  szoborpark = "SZOBORPARK",
  focipalya_nagyszinpad = "FOCIPÁLYA - NAGYSZÍNPAD",
  falukozpont_iskola = "FALUKÖZPONT - ISKOLA",
  falukozpont = "FALUKÖZPONT",
  focipalya_nappali_nagyharsany = "FOCIPÁLYA - NAPPALI KEMPING-BÁR & AFTERLIGET",
  both_miklos_udvara = "BOTH MIKLÓS UDVARA",
  szoborpark_amfiteatrum = "Szoborpark - AMFITEÁTRUM",
  // BEREMEND
  ddc_veled_kerek_udvar = "DDC VELED KEREK UDVAR",
  kovacsmuhely = "KOVÁCSMŰHELY",
  k2_feszek = "k2 FÉSZEK (református templom kertje)",
  szabadsag_ter = "Szabadság tér",
  szent_mihaly_templom = "Szent Mihály-templom",
  beremendi_reformatus_templom = "BEREMENDI REFORMÁTUS TEMPLOM",
  szinhazterem = "SZÍNHÁZTEREM",
  strandfurdo = "STRANDFÜRDŐ",
  megbekeles_kapolna = "MEGBÉKÉLÉS KÁPOLNA",
  focipalya_nappali_beremend = "FOCIPÁLYA - NAPPALI KEMPING-BÁR & AFTERLIGET",
  // VILLÁNYKÖVESD
  mentaliget = "MENTALIGET",
  pincesor = "PINCESOR",
  teleki_liget = "TELEKI LIGET",
  faluhaz = "FALUHÁZ",
  csikofuttato = "CSIKÓFUTTATÓ",
  nagycirkusz = "NAGYCIRKUSZ",
  blum_pince = "BLUM PINCE",
  //MOKOS SZÍNHÁZ
  mokos_pinceszet = "MOKOS PINCÉSZET",
  // VYLYAN TERASZ
  terasz = "TERASZ",
}

export const stageVillageMap = {
  [Village.nagyharsany]: [
    Stage.templom,
    Stage.falukozpont_arokpart_bar,
    Stage.tornaterem,
    Stage.narancsliget,
    Stage.pecsi_bolcsesz_udvar_aralica_kert,
    Stage.offlajn_rezervatum_a_helytorteneti_múzeum_mogott,
    Stage.szoborpark,
    Stage.focipalya_nagyszinpad,
    Stage.falukozpont_iskola,
    Stage.falukozpont,
    Stage.focipalya_nappali_nagyharsany,
    Stage.both_miklos_udvara,
    Stage.szoborpark_amfiteatrum,
  ],
  [Village.beremend]: [
    Stage.ddc_veled_kerek_udvar,
    Stage.kovacsmuhely,
    Stage.k2_feszek,
    Stage.szabadsag_ter,
    Stage.szent_mihaly_templom,
    Stage.beremendi_reformatus_templom,
    Stage.szinhazterem,
    Stage.strandfurdo,
    Stage.megbekeles_kapolna,
    Stage.focipalya_nappali_beremend,
  ],
  [Village.villanykovesd]: [
    Stage.mentaliget,
    Stage.pincesor,
    Stage.teleki_liget,
    Stage.faluhaz,
    Stage.csikofuttato,
    Stage.nagycirkusz,
    Stage.blum_pince,
  ],
  [Village.mokos]: [Stage.mokos_pinceszet],
  [Village.vylyan]: [Stage.terasz],
} as const;

export enum Topic {
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

export enum Day {
  tue = "tue",
  wed = "wed",
  thu = "thu",
  fri = "fri",
  sat = "sat",
}
