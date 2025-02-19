namespace TLU {
    /*                  Promises based version (browser.*)
    * Send a message to the current tab. Arguments are the same as browser.tabs.sendMessage(),
    *   except no tabId is provided.
    *
    * sendMessageToCurrentTab(
    *     message (any) message to send
    *     options (optional object) same as tabs.sendMessage():'frameId' prop is the frame ID.
    * )
    */
    export function sendMessageToAllTabs(msg: string, ...messageArgs: any[]) {
        return browser.tabs.query({currentWindow: true})
            .then((tabs) => {
                return Promise.all(
                    tabs.map(tab => 
                        browser.tabs.sendMessage(tab.id!, {msg: msg, args: messageArgs})
                            .catch(err => {
                                // Ignore errors about non-existing connections
                                if (!err.message.includes("Receiving end does not exist")) {
                                    console.error(`Error sending message to tab ${tab.id}:`, err);
                                }
                            })
                    )
                );
            });
    }
}

window.TLU = {
    ...window.TLU,
    ...TLU
};