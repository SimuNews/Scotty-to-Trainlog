function initOptions() {
    const input = document.getElementById("tlu-use-scheduled-data") as HTMLInputElement;
    input?.addEventListener("change", () => {
        localStorage.setItem("options.converter.use-scheduled-data", String(input.checked));
    });
    input.checked = (localStorage.getItem("options.converter.use-scheduled-data") ?? "true") === "true";
    // == Use platform specific waypoints ==
    const platformSpecificHandlingCheckbox = document.getElementById("tlu-use-platform-specific-waypoints") as HTMLInputElement;
    platformSpecificHandlingCheckbox?.addEventListener("change", () => {
        localStorage.setItem("options.converter.use-platform-specific-waypoints", String(platformSpecificHandlingCheckbox.checked));
    });
    platformSpecificHandlingCheckbox.checked = (localStorage.getItem("options.converter.use-platform-specific-waypoints") ?? "true") === "true";
    // == Base URL ==
    const baseUrlInput = document.getElementById("tlu-api-base-url") as HTMLInputElement;
    baseUrlInput?.addEventListener("change", () => {
        localStorage.setItem("options.api.base-url", baseUrlInput.value);
    });
    baseUrlInput.value = localStorage.getItem("options.api.base-url") || "";
}

initOptions();
