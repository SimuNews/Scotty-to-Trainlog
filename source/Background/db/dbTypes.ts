
export interface DBahnResponse {
    verbindungen: Verbindung[];
    verbindungReference: VerbindungReference;
}

export interface VerbindungReference {
    earlier: string;
    later: string;
}

export interface Verbindung {
    tripId: string;
    ctxRecon: string;
    verbindungsAbschnitte: VerbindungsAbschnitt[];
    umstiegsAnzahl: number;
    verbindungsDauerInSeconds: number;
    ezVerbindungsDauerInSeconds: number;
    isAlternativeVerbindung: boolean;
    auslastungsmeldungen: Auslastungsmeldung[];
    auslastungstexte: Auslastungstext[];
    himMeldungen: any[];
    risNotizen: any[];
    priorisierteMeldungen: any[];
    reservierungsMeldungen: any[];
    isAngebotseinholungNachgelagert: boolean;
    isAlterseingabeErforderlich: boolean;
    serviceDays: ServiceDay[];
    hasTeilpreis: boolean;
    reiseAngebote: any[];
    meldungen?: string[];
    meldungenAsObject?: MeldungenAsObject[];
    hinRueckPauschalpreis: boolean;
    isReservierungAusserhalbVorverkaufszeitraum: boolean;
    gesamtAngebotsbeziehungList: any[];
    mcpLink?: string;
    angebotsPreis?: AngebotsPreis;
    angebotsPreisKlasse?: string;
}

export interface AngebotsPreis {
    betrag: number;
    waehrung: string;
    mwst: Mwst[];
}

export interface Mwst {
    betrag: Betrag;
    brutto: Betrag;
    netto: Betrag;
    satz: number;
    literal?: string;
}

export interface Betrag {
    betrag: number;
    waehrung: string;
}

export interface MeldungenAsObject {
    code: string;
    nachrichtKurz: string;
    nachrichtLang: string;
    fahrtRichtungKennzeichen: string;
}

export interface ServiceDay {
    lastDateInPeriod: string;
    regular: string;
    irregular: string;
    planningPeriodBegin: string;
    planningPeriodEnd: string;
    weekdays: string[];
}

export interface Auslastungstext {
    klasse: string;
    stufe: number;
    kurzText: string;
    anzeigeText?: string;
    langText?: string;
}

export interface VerbindungsAbschnitt {
    risNotizen: any[];
    himMeldungen: any[];
    priorisierteMeldungen: any[];
    reservierungspflichtigNote?: string;
    abfahrtsZeitpunkt: string;
    ezAbfahrtsZeitpunkt: string;
    abfahrtsOrt: string;
    abfahrtsOrtExtId: string;
    abschnittsDauer: number;
    abschnittsAnteil: number;
    ankunftsZeitpunkt: string;
    ezAnkunftsZeitpunkt: string;
    ankunftsOrt: string;
    ankunftsOrtExtId: string;
    auslastungsmeldungen: Auslastungsmeldung[];
    halte: Halt[];
    idx: number;
    journeyId?: string;
    verkehrsmittel: Verkehrsmittel;
    externeBahnhofsinfoIdDestination?: string;
    externeBahnhofsinfoIdOrigin?: string;
    distanz?: number;
}

export interface Verkehrsmittel {
    produktGattung?: string;
    kategorie?: string;
    name: string;
    nummer?: string;
    typ: string;
    zugattribute: Zugattribute[];
    kurzText?: string;
    mittelText?: string;
    langText?: string;
    richtung?: string;
}

export interface Zugattribute {
    kategorie: string;
    key: string;
    value: string;
    teilstreckenHinweis?: string;
}

export interface Halt {
    id: string;
    abfahrtsZeitpunkt?: string;
    ezAbfahrtsZeitpunkt?: string;
    auslastungsmeldungen: Auslastungsmeldung[];
    name: string;
    risNotizen: RisNotiz[] | RisNotiz[][];
    extId: string;
    himMeldungen?: any[];
    routeIdx: number;
    priorisierteMeldungen: PriorisierteMeldung[] | any[];
    ankunftsZeitpunkt?: string;
    ezAnkunftsZeitpunkt?: string;
    gleis?: string;
    platformType?: PlatformType;
    bahnhofsInfoId?: string;
}

export interface PriorisierteMeldung {
    prioritaet: string;
    text: string;
}

export interface RisNotiz {
    key: string;
    value: string;
}

export interface PlatformType {
    code: string;
    shortDescription: string;
    longDescription: string;
    translations: Translations;
}

export interface Translations {
    en: En;
    fr: Fr;
    it: Fr;
    cs: Fr;
    da: Fr;
    es: Fr;
    nl: Fr;
    pl: Fr;
}

export interface Fr {
    shortDescription: string;
}

export interface En {
    shortDescription: string;
    longDescription: string;
}

export interface Auslastungsmeldung {
    klasse: string;
    stufe: number;
}