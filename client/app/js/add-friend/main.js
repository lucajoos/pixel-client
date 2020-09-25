const { ipcRenderer } = require("electron");

window.addEventListener('load', () => {
    window.addEventListener('keyup', e => {
        let ov = '';

        if(e.path[0] === document.getElementsByClassName('app_add-friend--value-username')[0]) {
            if(document.getElementsByClassName('app_add-friend--value-username')[0].value.length > 0 && ov !== document.getElementsByClassName('app_add-friend--value-username')[0].value) {
                ipcRenderer.send('screen_add-friend--search', document.getElementsByClassName('app_add-friend--value-username')[0].value);
                ov = document.getElementsByClassName('app_add-friend--value-username')[0].value;

                ipcRenderer.once('screen_add-friend--search-result', (event, data) => {
                    if(typeof data === 'object') {
                        [...document.getElementsByClassName('app_add-friend--options')[0].children].forEach(current => {
                            current.remove();
                        });

                        data.forEach(current => {
                            if(
                                typeof current.username === 'string' &&
                                typeof current.name === 'string' &&
                                typeof current.email === 'string' &&
                                typeof current.id === 'string'
                            ) {
                                let ce = document.createElement('div');
                                ce.innerHTML = `[${current.username}] ${current.name} (${current.email})`;

                                ce.addEventListener('click', () => {
                                    ipcRenderer.send('screen_add-friend--add', current.id);
                                    ce.remove();
                                });

                                document.getElementsByClassName('app_add-friend--options')[0].appendChild(ce);
                            }
                        });
                    }
                });
            }
        }
    });
});