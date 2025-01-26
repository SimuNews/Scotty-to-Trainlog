import "../../styles/scotty.scss";


    export function openDialog(title: string, message: string) {
        const dialogHtml = `
            <div class="hfs_overlayWin hfs_overlayHimEmergency" id="HFS_Overlay_TRAINLOG_UTILITIES" style="border: 1px black solid;">
                <div class="hfs_overlayHeader">
                    <button type="button" class="lyr_atomBtn hfs_overlayClose lyr_tooltip" data-close-dialog>
                        <span class="lyr_atomIcon lyr_tooltip">
                            <i class="haf_ic_clear" aria-hidden="true"></i>
                            <span class="lyr_tooltipText">Close</span>
                        </span>
                    </button>
                    <h2 class="hfs_overlayTitle">${title}</h2>
                </div>
                <div class="hfs_overlayContent">
                    <div class="hfs_toolboxWrapper hfs_himSearchToolboxWrapper">
                        <div class="hfs_toolboxBody">
                            <div class="lyr_himSearchMsgText">
                                ${message}
                            </div>
                        </div>
                        <div class="lyr_markasreadWrapper">
                            <button class="lyr_atomBtn lyr_atomPrimaryBtn" data-close-dialog type="button">
                                <span class="lyr_atomText">Mark as read</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const dialogContainer = document.createElement('div');
        dialogContainer.innerHTML = dialogHtml;
        document.body.appendChild(dialogContainer);
        dialogContainer.querySelectorAll('[data-close-dialog]').forEach(i => i.addEventListener('click', closeDialog));
    }

    function closeDialog() {
        const dialog = document.getElementById('HFS_Overlay_TRAINLOG_UTILITIES');
        if (dialog) {
            dialog.parentElement?.removeChild(dialog);
        }
    }
