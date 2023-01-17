const showNotification = async (options) => {
        const perm = await Notification.requestPermission();
        if(perm === "granted") {
            const notif = new Notification("Test notification", options);
            for(const p in options) {
                console.log(p, notif[p] === options[p]);
            }
        }
        else {
            throw new Error(`Permission was not granted: ${perm}`);
        }
    },
    showSWNotification = async (options) => {
        const perm = await Notification.requestPermission();
        if(perm === "granted" && navigator.serviceWorker) {
            const sw = await navigator.serviceWorker.ready;
            sw.showNotification("Test notification", options);
        }
        else {
            throw new Error(`Permission was not granted: ${perm}`);
        }
    },
    action = async (sw, timeout) => {
        const prefix = sw ? 'sw-' : '';
        const func = sw ? showSWNotification : showNotification;
        const status = document.getElementById(prefix + 'status');
        if (timeout > 0) {
            status.textContent = `${timeout}...`;
            setTimeout(action, 1000, sw, timeout - 1);
        } else {
            status.textContent = `Showing notification...`;
            try {
                await func({});
                status.textContent = `Notification displayed.`;
            } catch (e) {
                status.textContent = `Error: ` + e.toString();
            }
        }
    };

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById(   "immediately").addEventListener("click", () => action(false, 0));
    document.getElementById(   "five"       ).addEventListener("click", () => action(false, 5));
    document.getElementById("sw-immediately").addEventListener("click", () => action(true, 0));
    document.getElementById("sw-five"       ).addEventListener("click", () => action(true, 5));

    if ('serviceWorker' in navigator)
        navigator.serviceWorker.register('sw.js');
    else
        document.getElementById('service-worker-controls').textContent = 'Service workers unavailable. (Private window?)';
});
