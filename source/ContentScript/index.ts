import { browser } from "webextension-polyfill-ts";

// import all css files
import "../styles/scotty.scss";

browser.runtime.onMessage.addListener((e: {msg: string, args: any[]}) => {
    SCOTTY.ScottyScript.getInstance().eventListener(e);
    DBAHN.DBScript.getInstance().eventListener(e);
});

SCOTTY.ScottyScript.getInstance().addEventListenersToBtns();
DBAHN.DBScript.getInstance().placeTrainLogBtn();
