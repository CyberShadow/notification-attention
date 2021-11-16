/* global StoredBlob */
"use strict";

//TODO catch ServiceWorker scoped showNotification calls.

const NOTIFICATION_TOPIC = "new-notification",
    NotificationListener = {
        init() {
        },
        async attention(windowId) {
            await browser.windows.update(
                windowId,
                { drawAttention: true },
            );
            return true;
        },
    },
    DownloadListener = {
        DOWNLOAD_COMPLETE: "complete",
        init() {
            browser.downloads.onChanged.addListener(async (download) => {
                if(download.state.current === this.DOWNLOAD_COMPLETE && download.state.previous !== this.DOWNLOAD_COMPLETE) {
                    const lastWindow = await browser.windows.getLastFocused({
                        windowTypes: [ 'normal' ]
                    });
                    NotificationListener.attention(lastWindow.id)
                        .catch(console.error);
                }
            });
        }
    };

browser.runtime.onMessage.addListener((message, sender) => {
    if(message === NOTIFICATION_TOPIC) {
        NotificationListener.attention(sender.tab.windowId)
            .catch(console.error);
    }
});

NotificationListener.init();
DownloadListener.init();
