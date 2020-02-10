/* global window, document */
class GlobalConfig {
  constructor(defaultConfig) {
    this.config = defaultConfig;

    this.setMutableValues();

    const body = document.querySelector('body');

    if (this.config.touch) {
      body.classList.add('touch');
    } else {
      body.classList.remove('touch');
    }
  }

  setMutableValues() {
    console.log('config.js: GlobalConfig setMutableValues');

    this.config.touch = this.isTouchDevice;
    this.config.userAgent = {
      android: this.getUserAgent('Android'),
      safari: this.getUserAgent('Safari')
    };
    this.config.widthWindow = this.getWidthWindow;
    this.config.heightWindow = this.getHeightWindow;
  }

  getUserAgent(name) {
    const regExp = new RegExp(name, 'i');

    return regExp.test(navigator.userAgent);
  }

  get getConfig() {
    return this.config;
  }

  get isTouchDevice() {
    return 'ontouchend' in window || navigator.maxTouchPoints;
  }

  get getWidthWindow() {
    return window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;
  }

  get getHeightWindow() {
    return window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight;
  }
}

const defaultConfig = {
  class: {
    active: 'active',
    activeFlex: 'active-flex',
    disabled: 'disabled',
  },

  screen: {
    lg: 1199.8,
    md: 991.8,
    sm: 767.8,
    xs: 575.8,
    superXs: 339.8,
  },

  mobileDevice: false,

  cookie: {

  },


  token: document.querySelector('meta[name="csrf-token"]').getAttribute('content'),

  forms: {
    id: {
    },
  },

  api: {
    get: {

    },

    post: {

    },
  }
};

let config = new GlobalConfig(defaultConfig).getConfig;
window.config = config;

export default config;
