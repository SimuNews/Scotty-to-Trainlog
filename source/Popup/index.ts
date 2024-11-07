namespace STT {

    export class PopupPage {
        constructor() {
            const button = document.createElement("button");
            button.innerText = "Test button";
            document.querySelector("#popup-root")?.appendChild(button);
        }
    }
    
}

