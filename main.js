require('update-electron-app')();

const { ipcMain } = require('electron');

let onceupon = require('onceupon.js');
let db = require('basementdb')('./data');

let debug = require('./scripts/debug')();
let app = require('./scripts/app')();
let socket = require('./scripts/socket')();

let screens = [
    require('./scripts/screens/any'),
    require('./scripts/screens/main'),
    require('./scripts/screens/add-friend')
]

let events = onceupon();

let main = () => {
    app.create('screen_main', {
        width: 1100,
        height: 700
    }, window => {
        window.load('app/screens/main/index.html');
        window.window.webContents.openDevTools();
    });
};

events.once('app_authentication', () => {
    screens.forEach(current => {
        if(typeof current === 'function') {
            current(ipcMain, app, socket);
        }
    });

    main();
});

app.create('screen_loading', {
    width: 100,
    height: 500
}, window => {
    window.load('app/screens/connection/index.html');

    socket.once('ready', () => {
        app.close('screen_loading')
        events.fire('socket_connection', socket);
    })
});

events.once('socket_connection', socket => {
    socket.events.once('socket_authentication--request', () => {
        if(Object.keys(db.set('authentication').field('auto')).length > 0) {
            if(
                (typeof db.set('authentication').field('auto').id === 'string' ? db.set('authentication').field('auto').id.length > 0 : false) &&
                (typeof db.set('authentication').field('auto').sessionId === 'string' ? db.set('authentication').field('auto').sessionId.length > 0 : false)
            ) {
                socket.write('socket_authentication--authenticate', {
                    id: db.set('authentication').field('auto').id,
                    sessionId: db.set('authentication').field('auto').sessionId
                });
            }
        } else {
            app.create('screen_authentication', {
                width: 500,
                height: 300
            }, window => {
                window.load('app/screens/authentication/index.html');
                window.window.webContents.openDevTools();
    
                ipcMain.once('screen_authentication--exists', (event, data) => {
                    if(typeof data === 'string') {
                        socket.write('socket_authentication--exists', data);
    
                        socket.events.once('socket_authentication--exists', bool => {
                            event.reply('screen_authentication--exists', typeof bool === 'boolean' ? bool : false);
                        });
                    }
                });
    
                ipcMain.once('screen_authentication--authenticate', (event, data) => {
                    if(typeof data === 'object') {
                        socket.write('socket_authentication--authenticate', data);
                    }
                })
            });
        }

        socket.events.once('socket_authentication--session', data => {
            if(typeof data === 'object' ? ((typeof data.id === 'string' ? data.id.length > 0 : false) && (typeof data.sessionId === 'string' ? data.sessionId.length > 0 : false)) : false) {
                db.set('authentication').field('auto')['id'] = data.id;
                db.set('authentication').field('auto')['sessionId'] = data.sessionId;

                app.exists('screen_authentication', bool => {
                    if(bool) {
                        app.close('screen_authentication');
                    }
                });

                events.fire('app_authentication', null);
            }
        });
    });
});