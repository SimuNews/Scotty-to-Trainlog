export enum TabMessageType {
    NO_USERNAME,
    UPLOAD_SUCCESSFUL,
    UPLOAD_FAILED
}

export type ScottySearchMethods = "TripSearch" | "HimSearch";

export interface ScottyResponse {
    ver: string;
    ext: string;
    lang: string;
    id: string;
    err: string;
    graph: Graph;
    subGraph: Graph;
    view: View;
    svcResL: SvcResL[];
}

export interface SvcResL {
    id: string;
    meth: ScottySearchMethods;
    err: string;
    res: Res;
}

export interface Res {
    common: Common;
    outConL: OutConL[];
    outCtxScrB: string;
    outCtxScrF: string;
    fpB: string;
    fpE: string;
    planrtTS: string;
    outConGrpSettings: OutConGrpSettings;
}

export interface OutConGrpSettings {
    conGrpL: ConGrpL[];
    selectL: SelectL[];
    variant: string;
}

export interface SelectL {
    icoX: number;
    name: string;
    bitIdx: number;
}

export interface ConGrpL {
    name: string;
    icoX: number;
    grpid: string;
    conScoringL: ConScoringL[];
    initScoringType: string;
    requests: Request[];
    scrollable: boolean;
    bitmask: number;
}

export interface Request {
    id: string;
    autosend: boolean;
}

export interface ConScoringL {
    type: string;
    conScoreL: ConScoreL[];
    name: string;
}

export interface ConScoreL {
    score: number;
    scoreS: string;
    conRefL: number[];
}

export interface OutConL {
    cid: string;
    date: string;
    dur: string;
    durS: string;
    durR: string;
    chg: number;
    sDays: SDays;
    dep: Dep;
    arr: Arr;
    secL: SecL[];
    freq?: Freq2;
    trfRes: TrfRes;
    conSubscr: string;
    recState: string;
    cksum: string;
    cksumDti: string;
    cksumSave: string;
    intvlSubscr: string;
    originType: string;
    recon: Recon;
    durFmt: DTimeFS;
    hasDelayInfo: boolean;
}

export interface Recon {
    ctx: string;
}

export interface TrfRes {
    statusCode: string;
    extContActionBar: ExtContActionBar;
}

export interface ExtContActionBar {
    text: string;
    content: Content;
}

export interface Content {
    type: string;
    content: string;
}

export interface Freq2 {
    minC: number;
}

export interface SecL {
    type: string;
    dep: Dep;
    arr: Arr;
    jny: Jny;
    id: string;
}

export interface Jny {
    jid: string;
    date: string;
    prodX: number;
    dirTxt: string;
    dirFlg: string;
    status: string;
    isRchbl: boolean;
    stopL: StopL[];
    polyG: PolyG;
    pos?: IcoCrd;
    freq?: Freq;
    ctxRecon: string;
    msgL: MsgL2[];
    subscr: string;
    prodL: ProdL2[];
    dirL: DirL2[];
    sumLDrawStyleX: number;
    resLDrawStyleX: number;
    trainStartDate: string;
    durS: string;
}

export interface MsgL2 {
    type: string;
    remX?: number;
    sty: string;
    fLocX: number;
    tLocX: number;
    tagL: string[];
    sort: number;
    himX?: number;
}

export interface Freq {
    minC: number;
    maxC: number;
    numC: number;
    jnyL: JnyL[];
}

export interface JnyL {
    jid: string;
    date: string;
    prodX: number;
    dirTxt: string;
    dirFlg: string;
    status: string;
    isRchbl: boolean;
    stopL: StopL2[];
    ctxRecon: string;
    subscr: string;
    prodL: ProdL2[];
    dirL: DirL2[];
    sumLDrawStyleX: number;
    resLDrawStyleX: number;
    trainStartDate: string;
    durS: string;
}

export interface DirL2 {
    dirX: number;
    fLocX: number;
    tLocX: number;
    fIdx: number;
    tIdx: number;
}

export interface ProdL2 {
    prodX: number;
    fLocX: number;
    tLocX: number;
    fIdx: number;
    tIdx: number;
}

export interface StopL2 {
    locX: number;
    idx: number;
    dProdX?: number;
    dPltfS?: DPltfS;
    dPltfR?: DPltfS;
    dTimeS?: string;
    dTimeR?: string;
    dTimeFS?: DTimeFS;
    dTimeFR?: DTimeFR;
    dProgType?: string;
    dDirTxt?: string;
    dDirFlg?: string;
    dTZOffset?: number;
    type: string;
    aProdX?: number;
    aPltfS?: DPltfS;
    aPltfR?: DPltfS;
    aTimeS?: string;
    aTimeR?: string;
    aTimeFS?: DTimeFS;
    aTimeFR?: DTimeFR;
    aProgType?: string;
    aTZOffset?: number;
}

export interface PolyG {
    polyXL: number[];
}

export interface StopL {
    locX: number;
    idx: number;
    dProdX?: number;
    dPltfS?: DPltfS;
    dPltfR?: DPltfS;
    dTimeS?: string;
    dTimeR?: string;
    dTimeFS?: DTimeFS;
    dTimeFR?: DTimeFR;
    dProgType?: string;
    dDirTxt?: string;
    dDirFlg?: string;
    dTZOffset?: number;
    type: string;
    aProdX?: number;
    aPltfS?: DPltfS;
    aPltfR?: DPltfS;
    aTimeS?: string;
    aTimeR?: string;
    aTimeFS?: DTimeFS;
    aTimeFR?: DTimeFR;
    aProgType?: string;
    aTZOffset?: number;
    aPlatfCh?: boolean;
    dPlatfCh?: boolean;
}

export interface Arr {
    locX: number;
    idx: number;
    aProdX: number;
    aPltfS: DPltfS;
    aPltfR?: DPltfS;
    aTimeS: string;
    aTimeR?: string;
    aTimeFS: DTimeFS;
    aTimeFR?: DTimeFR;
    aProgType: string;
    aTZOffset: number;
    type: string;
}

export interface Dep {
    locX: number;
    idx: number;
    dProdX: number;
    dPltfS: DPltfS;
    dPltfR: DPltfS;
    dTimeS: string;
    dTimeR?: string;
    dTimeFS: DTimeFS;
    dTimeFR?: DTimeFR;
    dProgType: string;
    dTZOffset: number;
    type: string;
}

export interface DTimeFR {
    styleX: number;
    txtA: string;
}

export interface DTimeFS {
    styleX: number;
}

export interface DPltfS {
    type: string;
    txt: string;
}

export interface SDays {
    sDaysR: string;
    sDaysI: string;
    sDaysB: string;
}

export interface Common {
    locL: LocL[];
    prodL: ProdL[];
    polyL: PolyL[];
    opL: OpL[];
    remL: RemL[];
    himL: HimL[];
    icoL: IcoL[];
    reqLocL: ReqLocL[];
    himMsgEdgeL: HimMsgEdgeL[];
    himMsgCatL: HimMsgCatL[];
    dirL: DirL[];
    lDrawStyleL: LDrawStyleL[];
    timeStyleL: TimeStyleL[];
}

export interface TimeStyleL {
    mode: string;
    icoX?: number;
}

export interface LDrawStyleL {
    sIcoX?: number;
    type: string;
    bg: Fg;
    eIcoX?: number;
}

export interface DirL {
    txt: string;
    flg: string;
}

export interface HimMsgCatL {
    id: number;
}

export interface HimMsgEdgeL {
    icoCrd: IcoCrd;
}

export interface IcoCrd {
    x: number;
    y: number;
}

export interface ReqLocL {
    loc: Loc;
    state: string;
    eteId: string;
}

export interface Loc {
    lid: string;
    type: string;
    name: string;
    icoX: number;
    extId: string;
    state: string;
    crd: Crd;
    meta?: boolean;
    pCls: number;
    pRefL: number[];
    dist?: number;
    chgTime: string;
    isFavrbl: boolean;
    isHstrbl: boolean;
    globalIdL?: GlobalIdL[];
}

export interface IcoL {
    res?: string;
    fg?: Fg;
    bg?: Fg;
    txt?: string;
    txtA?: string;
    shp?: string;
}

export interface Fg {
    r: number;
    g: number;
    b: number;
}

export interface HimL {
    hid: string;
    act: boolean;
    head: string;
    text: string;
    icoX: number;
    prio: number;
    fLocX: number;
    tLocX: number;
    altSection?: string;
    prod: number;
    src: number;
    lModDate: string;
    lModTime: string;
    sDate: string;
    sTime: string;
    eDate: string;
    eTime: string;
    sDaily: string;
    eDaily: string;
    comp: string;
    catRefL: number[];
    pubChL: PubChL[];
    edgeRefL: number[];
    vDays?: VDays;
}

export interface VDays {
    sDaysB: string;
}

export interface PubChL {
    name: string;
    fDate: string;
    fTime: string;
    tDate: string;
    tTime: string;
}

export interface RemL {
    type: string;
    code: string;
    prio?: number;
    icoX: number;
    txtN: string;
    rtActivated?: boolean;
}

export interface OpL {
    name: string;
    icoX: number;
    matchId: string;
}

export interface PolyL {
    delta: boolean;
    dim: number;
    crdEncYX: string;
    crdEncS: string;
    crdEncF: string;
    ppLocRefL: PpLocRefL[];
    lDrawStyleX: number;
}

export interface PpLocRefL {
    ppIdx: number;
    locX: number;
}

export interface ProdL {
    name: string;
    icoX: number;
    cls: number;
    prodCtx: ProdCtx;
    pid?: string;
    nameS?: string;
    number?: string;
    oprX?: number;
}

export interface ProdCtx {
    name: string;
    num?: string;
    matchId?: string;
    catOut?: string;
    catOutS?: string;
    catOutL?: string;
    catIn?: string;
    catCode?: string;
    admin?: string;
}

export interface LocL {
    lid: string;
    type: string;
    name: string;
    icoX: number;
    extId: string;
    state: string;
    crd: Crd;
    pCls: number;
    entry?: boolean;
    msgL?: MsgL[];
    globalIdL: GlobalIdL[];
    chgTime: string;
}

export interface GlobalIdL {
    id: string;
    type: string;
}

export interface MsgL {
    type: string;
    remX: number;
    sty: string;
    tagL: string[];
    sort: number;
}

export interface Crd {
    x: number;
    y: number;
    floor: number;
}

export interface View {
    id: string;
    index: number;
    type: string;
}

export interface Graph {
    id: string;
    index: number;
}