const { ipcRenderer } = require('electron');

let c = false;
let bool;

let t = () => {
    if(
        document.getElementsByClassName('app_authentication--value-password')[0].value.length > 0 &&
        !bool ? (
            document.getElementsByClassName('app_authentication--value-name')[0].value.length > 0 &&
            document.getElementsByClassName('app_authentication--value-username')[0].value.length > 0
        ) : true
    ) {
        ipcRenderer.send('screen_authentication--authenticate', [...document.getElementsByClassName('pixel_object--input')].reduce((result, item, index, array) => {
            if(item.value.length > 0) {
                let n = '';

                item.classList.forEach(currentClass => {
                    if(currentClass.toString().startsWith('app_authentication--value-')) {
                        n = currentClass.toString().replace('app_authentication--value-', '');
                    }
                })

                result[n] = item.value;
            }
            
            return result;
        }, {}));
    }
};

let s = () => {
    if(
        document.getElementsByClassName('app_authentication--value-email')[0].value.length > 0
    ) {
        c = true;

        ipcRenderer.send('screen_authentication--exists', document.getElementsByClassName('app_authentication--value-email')[0].value);
        ipcRenderer.once('screen_authentication--exists', (event, bl) => {
            bool = bl;

            document.getElementsByClassName('app_authentication--value-email')[0].classList.add('pixel_state--hidden');
            document.getElementsByClassName('app_authentication--button-check')[0].classList.add('pixel_state--hidden');

            document.getElementsByClassName('app_authentication--value-password')[0].classList.remove('pixel_state--hidden');
            document.getElementsByClassName('app_authentication--button-submit')[0].classList.remove('pixel_state--hidden');

            if(typeof bool === 'boolean' ? !bool : true) {
                document.getElementsByClassName('app_authentication--value-name')[0].classList.remove('pixel_state--hidden');
                document.getElementsByClassName('app_authentication--value-username')[0].classList.remove('pixel_state--hidden');

                document.getElementsByClassName('app_authentication--value-name')[0].focus();
            } else {
                document.getElementsByClassName('app_authentication--value-password')[0].focus();
            }

            document.getElementsByClassName('app_authentication--button-submit')[0].addEventListener('click', () => {
                t();
            });
        })
    }
};

window.addEventListener('load', () => {
    document.getElementsByClassName('app_authentication--value-email')[0].focus();

    document.getElementsByClassName('app_authentication--button-check')[0].addEventListener('click', () => {
       s();
    });

    window.addEventListener('keypress', e => {
        if(e.code === 'Enter') {
            if(!c) {
                s();
            } else {
                t();
            }
        }
    })
});