function initOptions() {
    const input = document.getElementById("tlu-use-scheduled-data") as HTMLInputElement;
    input?.addEventListener("change", () => {
        localStorage.setItem("options.converter.use-scheduled-data", String(input.checked));
    });
    input.checked = localStorage.getItem("options.converter.use-scheduled-data") === "true";
}

initOptions();
