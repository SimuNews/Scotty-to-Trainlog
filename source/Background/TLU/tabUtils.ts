/*                  Promises based version (browser.*)
* Send a message to the current tab. Arguments are the same as browser.tabs.sendMessage(),
*   except no tabId is provided.
*
* sendMessageToCurrentTab(
*     message (any) message to send
*     options (optional object) same as tabs.sendMessage():'frameId' prop is the frame ID.
* )
*/
export function sendMessageToCurrentTab(msg: string, ...messageArgs: any[]) {
    var args: any[] = Array.of({msg: msg, args: messageArgs}); //Get arguments as an array
    return browser.tabs.query({active:true,currentWindow:true}).then((tabs) => {
        args.unshift(tabs[0].id); //Add tab ID to be the new first argument.
        return browser.tabs.sendMessage.apply(globalThis, args as any);
    });
}