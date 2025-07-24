namespace TLU {
    export class Options {
        private static readonly USE_SCHEDULED_DATA = "options.converter.use-scheduled-data";
        private static readonly USE_PLATFORM_SPECIFIC_WAYPOINTS = "options.converter.use-platform-specific-waypoints";

        public static isPreventRealtime(): boolean {
            return localStorage.getItem(Options.USE_SCHEDULED_DATA) === "true";
        }

        public static isUsePlatformSpecificWaypoints(): boolean {
            return (localStorage.getItem(Options.USE_PLATFORM_SPECIFIC_WAYPOINTS) ?? "true") === "true";
        }
    }
}

window.TLU = {
    ...window.TLU,
    ...TLU
}