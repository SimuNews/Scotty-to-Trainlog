import {browser} from 'webextension-polyfill-ts';

browser.runtime.onInstalled.addListener((): void => {
  console.log('🦄', 'extension installed');
});

function listener(details: any) {
  const filter = browser.webRequest.filterResponseData(details.requestId);
  const decoder = new TextDecoder("utf-8");
  const encoder = new TextEncoder();

  const data: any[] = [];
  filter.ondata = (event) => {
    data.push(event.data);
  };

  filter.onstop = async () => {
    const blob = new Blob(data, { type: "text/html" });
    const buffer = await blob.arrayBuffer();
    let str = decoder.decode(buffer);
    console.log(str);
    filter.write(encoder.encode(str));
    filter.close();
  };
}

browser.webRequest.onBeforeRequest.addListener(
  listener,
  { urls: ["*://*.oebb.at/*"], types: ["xmlhttprequest"] },
  ["blocking"],
);
