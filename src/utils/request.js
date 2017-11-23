const fetch = require('dva/fetch');
const config = window.appSystemConfigInfo;
const create_Head = require('./createHead');
const baseUrl = config[config.env];
function parseJSON(response) {
  return response.json();
}
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}
function request(api, options,type) {

  let _options = options || {method: 'get'};
  let _api = baseUrl + api;
  let noStop = true;
  _options.headers = {};
  if(['https://up.qbox.me'].indexOf(api) !== -1) {
    _api = api;
    noStop = false;
  };
  if (noStop) {
    _options.headers = create_Head(type ? 'X-AUTH' : 'X-TOKEN');
    if (_options.method !== 'get') {
      _options.headers["Content-Type"] =  "application/json";
    };
  };
  Object.assign(_options,{
    "mode": "cors",
  });
  return fetch(_api, _options)
    .then(checkStatus)
    .then(parseJSON)
    .then((data) => ({ data }))
    .catch((err) => ({ err }));
};
module.exports = request;
