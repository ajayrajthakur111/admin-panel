const getCookie = (cookieKey) =>{
   
    const cookie = document.cookie
       .split("; ")
       .find((row) => row.startsWith(`${cookieKey}=`))
       ?.slice(cookieKey.length + 1);
 
       return cookie
   }
   export default getCookie;
 
   