namespace INTERRAIL {

    export function eventListener(e: { msg: string; args: any[]; }) {
        console.log("eventListener", e);
        if (e?.msg === "tlu.interrail.timeTableLoaded") {
            placeTrainLogBtn();
        } else if (e?.msg === "tlu.interrail.upload.end") {
            resetButton(e.args[0]);
            openDialog("Upload successfull", `Trip from ${e.args[1]} to ${e.args[2]} has been uploaded to Trainlog.`);
        } else if (e?.msg === "tlu.interrail.no-username") {
            resetButton(e.args[0]);
            openDialog("No Username", "Please enter your Trainlog username in the extension options.");
        }
    }

    /**
    <div class="journey__label" style="margin-left: auto;cursor: pointer;">
        <img src="https://trainlog.me/static/images/logo_square.png" height="10px" width="10px">
        Upload to Trainlog
    </div>
     */
    export function placeTrainLogBtn() {
        document.querySelectorAll(".journey__card__status").forEach((element: Element, index: number) => {
            element.querySelectorAll(".journey__label.tlu-interrail").forEach((el: Element) => el.remove());
            const trainLogBtn = document.createElement("div");
            trainLogBtn.setAttribute("data-interrail-tlu-index", index.toString());
            trainLogBtn.classList.add("journey__label", "tlu-interrail");
            trainLogBtn.innerHTML = `
                <img src="${browser.runtime.getURL("assets/icons/interrail.png")}" height="10px" width="10px">
                <span class="tlu-interrail-text">Upload to Trainlog</span>
            `;
            trainLogBtn.addEventListener("click", (e: Event) => {
                e.stopPropagation();
                console.log("INTERRAIL: Upload to Trainlog");
                trainLogBtn.classList.add("loading");
                const labelElement = trainLogBtn.querySelector(".tlu-interrail-text");
                if (labelElement) {
                    labelElement.textContent = "Uploading...";
                }
                browser.runtime.sendMessage({interrailConId: index});
            });
            element.appendChild(trainLogBtn);
        });
    }

    function resetButton(index: number) {
        console.log("ResetButton", index);
        const trainLogBtn = document.querySelector(`[data-interrail-tlu-index="${index}"]`);
        if (trainLogBtn) {
            trainLogBtn.classList.remove("loading");
            const labelElement = trainLogBtn.querySelector(".tlu-interrail-text");
            if (labelElement) {
                labelElement.textContent = "Upload to Trainlog";
            }
        }
    }

    function openDialog(title: string, message: string) {
        const randId = Math.random();
        const dialogHtml = `
            <div class="nt-overlay nt-overlay__front" data-tlu-dialog="${randId}">
                <div class="nt-modal ">
                    <div class="nt-modal__body">
                        <div class="onboarding-flow">
                            <div class="onboarding-flow__header">
                                <h3 class="onboarding-flow__step-display"></h3><button data-close-dialog data-cy="skip-onboarding" type="button" class="ntt-button onboarding-flow__skip">Close</button>
                            </div>
                            <div class="auth app-my-account">
                                <div>
                                    <div>
                                        <div class="my-account" data-cy="my-account">
                                            <div class="my-account__content">
                                                <div class="ma-view">
                                                    <h1 class="ma-view__header sg-headline-1">${title}</h1>
                                                    <div>
                                                        ${message}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const dialogContainer = document.createElement('div');
        dialogContainer.innerHTML = dialogHtml;
        document.body.appendChild(dialogContainer);
        dialogContainer.querySelectorAll('[data-close-dialog]').forEach(i => i.addEventListener('click', () => closeDialog(randId)));
    }

    function closeDialog(randId: number): void {
        const dialog = document.querySelector(`[data-tlu-dialog="${randId}"]`);
        if (dialog) {
            dialog.remove();
        }
    }

}

window.INTERRAIL = {
    ...window.INTERRAIL,
    ...INTERRAIL
}