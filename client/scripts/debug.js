const uuid = require('uuid');

module.exports = () => {
    let con = [];

    console.clear();

    let render = (count, clear) => {
        if(typeof count !== 'number') {
            count = 0;
        }

        if(typeof clear !== 'boolean') {
            clear = false;
        }

        if(count === -1) {
            count = con.length;
        }

        if(clear) {
            console.clear();
        }

        if(con.length - count <= con.length) {
            con.slice(con.length - count, con.length).forEach(c => {
                if(c.visible) {
                    console.log(`[${c.type}]: ${c.data}`)
                    switch(c.type) {
                        case 0:
                            break;
                        case 1:
                            break;
                        case 2:
                            break;
                        default:
                            return;
                    }
                }
            })
        }
    }

    return {
        delete: (id, re) => {
            if(typeof id === 'string') {
                con.forEach((c, index) => {
                    if(typeof c === 'object') {
                        if(id === c.id) {
                            c.visible = false;

                            if(typeof re === 'boolean' ? re : true) {
                                render(-1, true);
                            }
                        }
                    }
                })
            }
        },

        clear: () => {
            con.forEach(c => {
                if(c.id === 'string') {
                    this.delete(c.id, false);
                }
            });

            render(-1, true);
        },

        say: (type, data) => {
            if(typeof data === 'string') {
                let id = uuid.v4();

                if(typeof type === 'string') {
                    switch(type) {
                        case 'log':
                        case '':
                            type = 0;
                            break;
                        case 'warning':
                            type = 1;
                            break;
                        case 'error':
                            type = 2;
                            break;
                        default:
                            return;
                    }
                }

                if(typeof type === 'number') {
                    con.push({
                        type: type,
                        data: data,
                        visible: true,
                        id: id
                    });
                }

                render(1);

                return id;
            }
        }
    }
}