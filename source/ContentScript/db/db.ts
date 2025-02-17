namespace DBAHN {
    export class DBScript extends TLU.ContentScript {

        private static instance: DBScript;

        public static getInstance(): DBScript {
            if (!DBScript.instance) {
                DBScript.instance = new DBScript();
            }
            return DBScript.instance;
        }

        public eventListener(e: { msg: string; args: any[]; }) {
            const msg = e?.msg;
            if (msg === "tlu.dbahn.timeTableLoaded") {
                this.placeTrainLogBtn();
            } else if (e?.msg === "tlu.dbahn.upload.end") {
                this.resetButton();
                this.openDialog("Upload successfull", `Trip from ${e.args[1]} to ${e.args[2]} has been uploaded to Trainlog.`);
            } else if (e?.msg === "tlu.dbahn.no-username") {
                this.resetButton();
                this.openDialog("No Username", "Please enter your Trainlog username in the extension options.");
            }
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
                console.log("DB: Upload to Trainlog");
                divElement.classList.add("loading");
                const labelElement = divElement.querySelector(".db-web-button__label");
                if (labelElement) {
                    labelElement.textContent = "Uploading...";
                }
                const connItem = divElement.closest(".verbindung-list__result-item");
                const conId = connItem?.classList.item(1)?.replace("verbindung-list__result-item--", "");
                browser.runtime.sendMessage({dbConId: conId});
            });
            return divElement;
        }

        private resetButton(): void {
            document.querySelectorAll("._dialogButton.tlu-dbahn.loading").forEach((element) => {
                element.classList.remove("loading");
                const labelElement = element.querySelector(".db-web-button__label");
                if (labelElement) {
                    labelElement.textContent = "Upload to Trainlog";
                }
            });
        }

        private openDialog(title: string, message: string): void {
            const randId = Math.random();
            const dialogHtml = `
                <div id="DBWebDialogPlugin-1" data-tlu-dbahn-dialog="${randId}" data-v-app="">
                    <dialog data-v-d824dfcf=""
                        class="db-web-plugin-dialog-container db-web-plugin-dialog-container--no-padding-on-mobile"
                        aria-describedby="dialog-header" open="">
                        <div data-v-0cb11dab="" data-v-e673a6ba="" data-v-d824dfcf=""
                            class="db-web-plugin-dialog--overflow-scroll db-web-plugin-dialog QuickFinderDialog test-dialog-content">
                            <div data-v-0cb11dab="" class="db-web-plugin-dialog__header-wrapper">
                                <div data-v-0cb11dab=""
                                    class="db-web-plugin-dialog__header db-web-plugin-dialog__header--overflow-scroll">
                                    <h2 data-v-0cb11dab="" id="dialog-header" class="db-web-plugin-dialog__header-text">${title}
                                    </h2>
                                    <button data-v-319b878d="" data-v-0cb11dab="" type="button" data-close-dialog=""
                                        class="db-web-button test-db-web-button db-web-button--type-icon db-web-button--size-largeResponsive db-web-button--type-plain db-web-button--underline db-web-plugin-dialog__close-button test-dialog-close-btn"
                                        tabindex="0" autofocus=""><span data-v-319b878d=""
                                            class="db-web-button__content db-web-button__content--min-clickable-area">
                                            <span data-v-319b878d="" class="util__offscreen">Close dialog</span>
                                            <span data-v-e3149fe0="" data-v-319b878d="" aria-hidden="true"
                                                class="db-color--dbGray5 icon-close db-web-icon db-web-button__icon test-button-appendicon db-web-button__icon--primary"></span>
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <div data-v-0cb11dab="" class="db-web-plugin-dialog__customSlotWrapper" style="padding: 24px;">
                                ${message}
                            </div>
                        </div>
                    </dialog>
                </div>
            `;
            
            const dialogContainer = document.createElement('div');
            dialogContainer.innerHTML = dialogHtml;
            document.body.appendChild(dialogContainer);
            console.log(dialogContainer);
            dialogContainer.querySelectorAll('[data-close-dialog]').forEach(i => i.addEventListener('click', () => this.closeDialog(randId)));
        }

        private closeDialog(id: number): void {
            const dialog = document.querySelector(`[data-tlu-dbahn-dialog="${id}"]`);
            if (dialog) {
                dialog.parentElement?.removeChild(dialog);
            }
        }
    }
}

window.DBAHN = {
    ...window.DBAHN,
    ...DBAHN
};
