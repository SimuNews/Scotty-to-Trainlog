namespace SCOTTY {

    export class ScottyScript extends TLU.ContentScript {

        private static instance: ScottyScript;

        public static getInstance(): ScottyScript {
            if (!ScottyScript.instance) {
                ScottyScript.instance = new ScottyScript();
            }
            return ScottyScript.instance;
        }

        public eventListener(e: { msg: string; args: any[]; }) {
            if (e?.msg === "stt.scotty.saved") {
                this.addEventListenersToBtns();
            } else if (e?.msg === "stt.scotty.upload.end") {
                this.resetButton();
                this.openDialog("Upload successfull", `Trip from ${e.args[0]} to ${e.args[1]} has been uploaded to Trainlog.`);
            } else if (e?.msg === "stt.scotty.no-username") {
                this.resetButton();
                this.openDialog("No Username", "Please enter your Trainlog username in the extension options.");
            }
        }

        public addEventListenersToBtns() {
            let clickableAtomBtns = document.querySelectorAll(".lyr_atomBtn");
            clickableAtomBtns.forEach((e) => {
                e.addEventListener("click", this.appendTrainLogBtn);
            });
        }

        private openDialog(title: string, message: string) {
            const randId = Math.random();
            const dialogHtml = `
                <div class="hfs_overlayWin hfs_overlayHimEmergency" id="HFS_Overlay_${randId}" style="border: 1px black solid;">
                    <div class="hfs_overlayHeader">
                        <button type="button" class="lyr_atomBtn hfs_overlayClose lyr_tooltip" data-close-dialog>
                            <span class="lyr_atomIcon lyr_tooltip">
                                <i class="haf_ic_clear" aria-hidden="true"></i>
                                <span class="lyr_tooltipText">Close</span>
                            </span>
                        </button>
                        <h2 class="hfs_overlayTitle">${title}</h2>
                    </div>
                    <div class="hfs_overlayContent">
                        <div class="hfs_toolboxWrapper hfs_himSearchToolboxWrapper">
                            <div class="hfs_toolboxBody">
                                <div class="lyr_himSearchMsgText">
                                    ${message}
                                </div>
                            </div>
                            <div class="lyr_markasreadWrapper">
                                <button class="lyr_atomBtn lyr_atomPrimaryBtn" data-close-dialog type="button">
                                    <span class="lyr_atomText">Mark as read</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            const dialogContainer = document.createElement('div');
            dialogContainer.innerHTML = dialogHtml;
            document.body.appendChild(dialogContainer);
            dialogContainer.querySelectorAll('[data-close-dialog]').forEach(i => i.addEventListener('click', () => this.closeDialog(randId)));
        }

        private closeDialog(id: number): void {
            const dialog = document.getElementById(`HFS_Overlay_${id}`);
            if (dialog) {
                dialog.parentElement?.removeChild(dialog);
            }
        }
        
        private appendTrainLogBtn() {
            const containers = document.querySelectorAll(".lyr_tpActionButtons:not(:has(.stt-trainlog))");
            console.log(containers);
            containers.forEach(e => e.appendChild(this.createTrainLogBtn()));
            this.addEventListenersToBtns();
        }
        
        /*
        <button class="lyr_atomBtn lyr_atomActionBtn stt-trainlog" type="button">
        <span class="lyr_atomIcon  ">
            <i class="haf_ic_quickaction_ticket" aria-hidden="true"></i>
            <span class="lyr_atomIconText"></span>
        </span>
        <span class=" lyr_atomText">To Trainlog</span>
        </button>
        */
        private createTrainLogBtn(): HTMLElement {
            const btn = document.createElement("button");
            btn.classList.add("lyr_atomBtn");
            btn.classList.add("lyr_atomActionBtn");
            btn.classList.add("stt-trainlog");
            btn.type = "button";
        
            const iconSpan = document.createElement("span");
            iconSpan.classList.add("lyr_atomIcon");
        
            const icon = document.createElement("img");
            icon.src = browser.runtime.getURL("assets/icons/logo_trainlog.png");
            icon.width = 20;
            icon.height = 20;
            icon.ariaHidden = "true";
        
            const iconTextSpan = document.createElement("span");
            iconTextSpan.classList.add("lyr_atomIconText");
        
            iconSpan.appendChild(icon);
            iconSpan.appendChild(iconTextSpan);
        
            const textSpan = document.createElement("span");
            textSpan.classList.add("lyr_atomText");
            textSpan.innerText = "To Trainlog";
        
            btn.appendChild(iconSpan);
            btn.appendChild(textSpan);
        
            btn.addEventListener("click", (e: Event) => {
                this.onTrainlogBtnClick(e.target as HTMLElement);
                btn.classList.add("tlu-loading-indicator");
                textSpan.innerText = "Uploading...";
            });
        
            return btn;
        }
        
        private resetButton() {
            document.querySelectorAll(".tlu-loading-indicator").forEach(e => {
                e?.classList.remove("tlu-loading-indicator");
                (e.querySelector(".lyr_atomText") as HTMLElement).innerText = "To Trainlog";
            });
        }
        
        private onTrainlogBtnClick(btn: HTMLElement) {
            const tripContainer = btn.closest(".lyr_tpConDetailWrapper");
            const id = tripContainer?.id as string;
            console.log("Connection Id: " + id?.replace("HFS_RES_PT_", ""));
            browser.runtime.sendMessage({conId: id?.replace("HFS_RES_PT_", "")});
        }
    }
}

window.SCOTTY = {
    ...window.SCOTTY,
    ...SCOTTY
};
