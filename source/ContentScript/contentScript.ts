namespace TLU {
    export abstract class ContentScript {
        /**
         * Instance event listener that must be overridden by the subclass
         * @param e The event object containing message and arguments
         */
        public abstract eventListener(e: { msg: string; args: any[]; }): void;
    }
}

window.TLU = {
    ...window.TLU,
    ...TLU
};