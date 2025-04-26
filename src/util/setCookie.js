const setCookie = (cookieKey, value, path = "/") =>
    (document.cookie = `${cookieKey}=${value}; PATH=${path}`);
  
  export default setCookie;