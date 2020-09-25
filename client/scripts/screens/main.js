module.exports = (ipcMain, app, socket) => {
    ipcMain.on('screen_main--add-friend', () => {
        app.get('screen_main', main => {
            app.create('screen_add-friend', {
                parent: main.window,
                modal: true,

                width: 400,
                height: 600
            }, window => {
                window.load('app/screens/add-friend/index.html');

                window.window.webContents.openDevTools();
            });
        })
    });

    socket.on('screen_main--friend', friend => {
        console.log(friend);
    });
}