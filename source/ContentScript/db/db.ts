namespace DBAHN {
    export class DBScript extends TLU.ContentScript {

        private static instance: DBScript;

        public static getInstance(): DBScript {
            if (!DBScript.instance) {
                DBScript.instance = new DBScript();
            }
            return DBScript.instance;
        }

        public placeTrainLogBtn(): void {
            console.log("placeTrainLogBtn for bahn.de");
            document.querySelectorAll(
                ".reiseloesung__item-right:not(:has(._dialogButton.tlu-dbahn))"
            ).forEach((element) => {
                element.appendChild(this.createTrainLogBtn())
            });
        }

        private createTrainLogBtn(): HTMLElement {
            const divElement = document.createElement("div");
            divElement.classList.add("_dialogButton", "tlu-dbahn");
            divElement.setAttribute("data-v-0c256d8c", "");
            divElement.setAttribute("data-v-7dd2173f", "");

            divElement.innerHTML = `
                <button data-v-67baa87f="" data-v-26c01d21="" data-v-0c256d8c="" type="button" class="db-web-button test-db-web-button db-web-button--type-link db-web-button--size-regular db-web-button--type-plain db-web-button--breakwords db-web-button--underline DialogButton reiseloesung__rueckfahrt-selection-button test-reiseloesung__rueckfahrt-selection" tabindex="0" id="btn-rueckfahrt_large">
                    <span data-v-67baa87f="" class="db-web-button__content db-web-button__content--breakwords">
                        <span data-v-e3149fe0="" data-v-67baa87f="" aria-hidden="true" class="db-color--dbGray5 db-web-icon db-web-button__icon db-web-button__prepend-icon test-button-prependicon db-web-button__icon--primary">
                            <img width="20px" height="20px" src="${browser.runtime.getURL("assets/icons/dbahn.png")}" />
                        </span>
                        <span data-v-67baa87f="" class="db-web-button__label test-button-label db-web-button__label--breakwords db-web-button__label--breakwords-link">Upload to Trainlog</span>
                    </span>
                </button>
            `;
            divElement.addEventListener("click", () => {
                console.log("Upload to Trainlog");
                const connItem = divElement.closest(".verbindung-list__result-item");
                console.log("Connection Id: ", connItem);
                const conId = connItem?.classList.item(1)?.replace("verbindung-list__result-item--", "");
                console.log("Connection Id: ", conId);
                browser.runtime.sendMessage({dbConId: conId});
            });
            return divElement;
        }

        public eventListener(e: { msg: string; args: any[]; }) {
            const msg = e?.msg;
            if (msg === "tlu.dbahn.timeTableLoaded") {
                this.placeTrainLogBtn();
            }
        }
    }
}

window.DBAHN = {
    ...window.DBAHN,
    ...DBAHN
};
