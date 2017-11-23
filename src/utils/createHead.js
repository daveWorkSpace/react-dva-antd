

const CryptoJS = require("crypto-js");
const config = window.appSystemConfigInfo;
const {getTOKEN, getSTAMP} = require('./utils');


function create_AUTH_SIGN(stamp) {
  const _msg = [stamp,stamp].join(':');

  let _result = CryptoJS.HmacMD5(_msg, config.publisher_key);
  return _result.toString();
}

function create_TOKEN_SIGN(token,stamp) {
  const _msg = [token,stamp,stamp].join(':');
  let _result = CryptoJS.HmacMD5(_msg, config.publisher_key);
  return _result.toString();
}

function create_Head(type) {

  const stamp = getSTAMP();
  let _result = {
    'X-APP-KEY': config.access_key,
    'X-MSG-ID': [stamp,stamp].join(','),
  };
  let _sign =null;
  if(type === 'X-AUTH') {
    _sign = create_AUTH_SIGN(stamp);
    _result[type] = [_sign].join(','); // [_sign,'publisher'].join(',')
  } else {
    const token = getTOKEN();
    _sign = create_TOKEN_SIGN(token,stamp);
    _result[type] = [token,_sign].join(',');
  };
  return _result;
};

module.exports = create_Head;
