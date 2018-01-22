function inject(payload, cb) {
  chrome.tabs.query(
    { active: true, currentWindow: true },
    (tabs) => {
      // console.log('tabs:', tabs);
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { message: 'inject', payload }, (res) => {
          if (cb) {
            cb(res);
          }
        });
      }
    },
  );
}

export default inject;
