

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
  
  export default {isStringEmpty, checkTel, checkPwd, checkNickname}