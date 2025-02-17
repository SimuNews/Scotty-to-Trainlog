namespace TLU {
    export function formatDateJson(date?: Date): string {
        if (!date) {
            return "";
        }
        const dateString = date.toJSON();
        return `${dateString.substring(0, 10)}`;
    }

    export function formatTime(date?: Date): string {
        if (!date) {
            return "";
        }
        const timeString = date.toJSON();
        return `${timeString.substring(11, 16)}`;
    }

    export function formatDateTime(date?: Date): string {
        if (!date) {
            return "";
        }
        return `${formatDateJson(date)}T${formatTime(date)}`;
    }
}

window.TLU = {
    ...window.TLU,
    ...TLU
};