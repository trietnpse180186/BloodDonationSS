const logout = () => {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
  window.location.href = "/login";
};

export default logout;
