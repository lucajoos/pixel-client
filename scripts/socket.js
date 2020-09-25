const net = require('net');
const onceupon = require('onceupon.js');

module.exports = (address, port) => {
    let socket = new net.Socket();
    let process = onceupon();
    let events = onceupon();
    let session = '';

    socket.connect(typeof port === 'number' ? port : 61337, typeof address === 'string' ? address : 'localhost', () => {
        process.fire('ready');
    });

    socket.on('data', data => {
        data = data.toString();


        if(typeof data === 'string') {
            try {
                data = JSON.parse(data);

                if(typeof data.session === 'string') {
                    session = data.session;
                }

                if(typeof data === 'object' ? typeof data.event === 'string' : false) {
                    events.fire(data.event, typeof data.data !== 'undefined' ? data.data : null);
                } else {
                    process.fire('error', 'Wrong communication type');
                }
            } catch(error) {
                process.fire('error', error);
            }

        }
    });

    return {
        on: process.on,
        once: process.once,

        write: (event, data) => {
            if(typeof event === 'string') {
                process.once('ready', () => {
                    socket.write(JSON.stringify({
                        event: event,
                        data: typeof data !== 'undefined' ? data : null,
                        session: session
                    }));
                })
            }
        },

        events: {
            on: events.on,
            once: events.once,
        },

        end: () => {
            socket.destroy();
            process.fire('end');
        },

        _: socket
    }
}