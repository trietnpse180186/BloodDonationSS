export function logout() {
  const accessToken = localStorage.getItem("accessToken");

  fetch("http://localhost:8080/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      localStorage.removeItem("accessToken");
      window.location.href = "/";
    })
    .catch((error) => {
      console.error(error);
    });
}
