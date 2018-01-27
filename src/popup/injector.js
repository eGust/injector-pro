const INJECT_MESSAGE = 'INJECT';

function inject(payload, cb) {
  chrome.tabs.query(
    { active: true, currentWindow: true },
    (tabs) => {
      // console.log('tabs:', tabs);
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { message: INJECT_MESSAGE, payload }, (res) => {
          if (cb) {
            cb(res);
          }
        });
      }
    },
  );
}

function elementExists({ element, attributes }) {
  const attrs = Object.keys(attributes).map(key => `[${key}="${attributes[key]}"]`);
  return document.querySelector(`${element}${attrs.join('')}`);
}

class Injector {
  constructor({ title, items }) {
    this.logs = [];
    this.elements = items;
    this.title = title;
  }

  log(msg) {
    this.logs.push(msg);
    console.log(msg);
  }

  loadElement({ element, attributes }, asyncLoad) {
    return new Promise((resolve) => {
      const el = document.createElement(element);

      Object.keys(attributes).forEach((key) => {
        el.setAttribute(key, attributes[key]);
      });

      if (asyncLoad) {
        el.onload = () => {
          this.log('sync loaded!');
          resolve();
        };
      }
      document.head.appendChild(el);

      if (!asyncLoad) {
        resolve();
      }
    });
  }

  async injectItem({ ext, url }, wait = 0) {
    const el = ext === '.css' ? {
      element: 'link',
      type: 'style',
      attributes: {
        ref: 'stylesheet',
        href: url,
      },
    } : {
      element: 'script',
      type: 'script',
      attributes: {
        src: url,
      },
    };

    if (elementExists(el)) {
      this.log(`Ignored: ${el.type} ${url}`);
    } else {
      this.log(`[${wait ? 'await' : 'async'}] Inject: (${el.type}) ${url}`);
      await this.loadElement(el, wait);
    }
  }

  shouldWait(index) {
    for (let i = index + 1; i < this.elements.length; i += 1) {
      const el = this.elements[i];
      if (el.ext !== '.css') {
        return el.wait;
      }
    }
    return false;
  }

  async inject(index = 0) {
    const len = this.elements.length;
    if (index >= len) return this;

    const el = this.elements[index];
    await this.injectItem(el, el.ext !== '.css' && this.shouldWait(index));
    await this.inject(index + 1);
    return this;
  }

  getResponseMessage() {
    return {
      message: 'INJECTED',
      payload: {
        title: this.title,
        log: this.logs.join('\n'),
      },
    };
  }
}

async function injectDebug(payload) {
  console.log(JSON.parse(JSON.stringify(payload)));
  const injector = new Injector(payload);
  await injector.inject();
  console.log(injector.getResponseMessage());
}

const injector = process.env.NODE_ENV === 'production' ? inject : injectDebug;

export default injector;
