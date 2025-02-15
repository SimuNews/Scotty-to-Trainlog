import { Browser } from 'webextension-polyfill-ts';
import * as JQEURY from "jquery";

declare global {
    const browser: Browser;
    const jq: JQEURY;
}