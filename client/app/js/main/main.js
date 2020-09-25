const { ipcRenderer } = require('electron');

window.addEventListener('load', () => {
    ipcRenderer.on('screen_any--get-data', (event, data) => {
        document.getElementsByClassName('app_main--button-add-friend')[0].addEventListener('click', () => {
            ipcRenderer.send('screen_main--add-friend');
        });
    });

    ipcRenderer.send('screen_any--get-data');
});