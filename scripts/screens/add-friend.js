module.exports =(ipcMain, app, socket) => {
    ipcMain.on('screen_add-friend--search', (ev, data) => {
        socket.events.once('socket_add-friend--search-response', res => {
            ev.reply('screen_add-friend--search-result', res);
        }, true);

        socket.write('socket_add-friend--search', data);
    });

    ipcMain.on('screen_add-friend--add', (ev, data) => {
        socket.write('socket_add-friend--add', data);

        app.exists('screen_add-friend', bool => {
            if(bool) {
                app.close('screen_add-friend');
            }
        })
    });
}