namespace TLU {
    export class Options {
        private static readonly USE_SCHEDULED_DATA = "options.converter.use-scheduled-data";

        public static isPreventRealtime(): boolean {
            return localStorage.getItem(Options.USE_SCHEDULED_DATA) === "true";
        }
    }
}

window.TLU = {
    ...window.TLU,
    ...TLU
}