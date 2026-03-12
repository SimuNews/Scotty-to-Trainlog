namespace TLU {
    export class Options {
        private static readonly USE_SCHEDULED_DATA = "options.converter.use-scheduled-data";
        private static readonly USE_DELAY_FIELDS = "options.converter.use-delay-fields";
        private static readonly USE_PLATFORM_SPECIFIC_WAYPOINTS = "options.converter.use-platform-specific-waypoints";

        public static isPreventRealtime(): boolean {
            return localStorage.getItem(Options.USE_SCHEDULED_DATA ?? "false") === "true" || this.isUseDelayFields();
        }

        public static isUseDelayFields(): boolean {
            return (localStorage.getItem(Options.USE_DELAY_FIELDS) ?? "true") === "true";
        }

        public static isUsePlatformSpecificWaypoints(): boolean {
            return (localStorage.getItem(Options.USE_PLATFORM_SPECIFIC_WAYPOINTS) ?? "true") === "true";
        }

        public static getBaseUrl(): string | null {
            return localStorage.getItem("options.api.base-url");
        }
    }
}

window.TLU = {
    ...window.TLU,
    ...TLU
}