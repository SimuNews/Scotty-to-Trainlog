namespace TLU {
    export function formatDateTime(date?: Date): string {
        if (!date) {
            return "";
        }
        const dateString = date.toJSON();
        const timeString = date.toTimeString();
        return `${dateString.substring(0, 10)}T${timeString.substring(0, 5)}`;
    }
}

window.TLU = {
    ...window.TLU,
    ...TLU
}