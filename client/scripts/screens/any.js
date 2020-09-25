let uuid = require('uuid');

module.exports = (ipcMain, app, socket) => {
    ipcMain.on('screen_any--get-data', ev => {
        let id = uuid.v4();

        socket.write('socket_main--get-data', id);

        socket.events.on('socket_main--get-data', response => {
            if(typeof response === 'object' ? ((typeof response.id === 'string' ? (response.id === id) : false) && typeof response.data === 'object') : false) {
                ev.reply('screen_any--get-data', response.data);
            }
        })
    });
}