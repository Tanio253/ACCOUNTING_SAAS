// utils/auth.js
export const isAuthenticated = () => {
    return localStorage.getItem("token") ? true : false;
  };
  
  export const getToken = () => {
    return localStorage.getItem("token");
  };
  
  // export const logout = () => {
  //   localStorage.removeItem("token");
  //   window.location.href = "/login";
  // };