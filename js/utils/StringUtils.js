
function isStringEmpty(str) {
  if (!str || str.trim().length === 0) {
    return true;
  }
  return false;
}

function checkTel(str) {
  return str.trim().match('^\\d{11}$');
}

function checkPwd(str) {
  return str.trim().match('^[0-9_a-zA-Z]{6,12}$');
}

function checkNickname(str) {
  return str.trim().match('^\\S{2,12}$');
}
function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}
function param(json) {
  if (!json) return ''
  return cleanArray(Object.keys(json).map(key => {
    if (json[key] === undefined) return ''
    return encodeURIComponent(key) + '=' +
      encodeURIComponent(json[key])
  })).join('&')
}

export default { isStringEmpty, checkTel, checkPwd, checkNickname, param }