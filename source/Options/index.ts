namespace STT {

    export class OptionsPage {
        constructor() {
            const button = document.createElement("button");
            button.innerText = "Test button";
            document.querySelector("#options-root")?.appendChild(button);
        }
    }

}

