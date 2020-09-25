const { app, BrowserWindow } = require('electron');

const uuid = require('uuid');
let onceupon = require('onceupon.js');

module.exports = () => {
    let events = onceupon();
    let windows = [];

    app.whenReady().then(() => {
        if(!app.isDefaultProtocolClient('pixel') && app.isPackaged()) {
            app.setAsDefaultProtocolClient('pixel');
        }

        events.fire('ready');
    });

    app.on('window-all-closed', () => {
        if(process.platform !== 'darwin') {
            //app.quit()
        }
    });

    let r = {
        once: events.once,
        on: events.on,

        get: (tag, callback) => {
            if(typeof tag === 'string' && windows.length > 0) {
                windows.forEach(w => {
                    if(tag === w.name ? true : (tag === w.id)) {
                        if(typeof callback === 'function') {
                            callback(w);
                        }
                    }
                });
            }
        },

        exists: (tag, callback) => {
            if(typeof tag === 'string' && windows.length > 0) {
                r.get(tag, window => {
                    if(typeof callback === 'function') {
                        callback(typeof window === 'object');
                    }
                });
            }
        },

        create: (name, options, callback) => {
            events.once('ready', () => {
                if(typeof name === 'string') {
                    let def = {
                        webPreferences: {
                            nodeIntegration: true
                        }
                    };

                    if(typeof options === 'object') {
                        def = Object.assign(def, options);
                    }

                    let w = {
                        load: path => {
                            w.window.loadFile(path);
                        },

                        window: new BrowserWindow(def),
                        name: name,
                        id: uuid.v4()
                    };

                    w.window.setMenuBarVisibility(false);
        
                    windows.push(w);
                    events.fire('window-created', w);

                    if(typeof callback === 'function') {
                        callback(w)
                    }
                }
            });
        },

        close: (tag, callback) => {
            events.on('ready', () => {
                if(typeof tag === 'string' && windows.length > 0) {
                    r.get(tag, window => {
                        if(typeof window === 'object') {
                            window.window.close();
                            events.fire('window-closed', window);

                            if(typeof callback === 'function') {
                                callback(window);
                            }
                        }
                    });
                }
            });
        }
    };

    return r;
}