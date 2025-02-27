import { browser } from "webextension-polyfill-ts";

// import all css files
import "../styles/trainlog_utilities.scss";

browser.runtime.onMessage.addListener((e: {msg: string, args: any[]}) => {
    if (SCOTTY.ScottyScript) {
        SCOTTY.ScottyScript.getInstance().eventListener(e);
    }
    if (DBAHN.DBScript) {
        DBAHN.DBScript.getInstance().eventListener(e);
    }
    if (INTERRAIL.eventListener) {
        INTERRAIL.eventListener(e);
    }
});