const getManifest = process.env.NODE_ENV === 'production' ?
  () => chrome.runtime.getManifest() :
  (() => {
    // eslint-disable-next-line
    const manifest = require('../static/manifest.json');
    console.log(manifest);
    return () => manifest;
  })();

export default getManifest;
