function initPopup() {
    const input = document.getElementById("sttUsernameInput") as HTMLInputElement;
    input?.addEventListener("change", () => {
        localStorage.setItem("username", input.value);
    });
    input.value = localStorage.getItem("username") ?? "";
}

initPopup();