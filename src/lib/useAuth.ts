
export function useAuth() {
  let storedToken="";
    if (typeof window !== "undefined") {
      storedToken = localStorage.getItem("token") || "";
      console.log("UseAuth Token: ", storedToken); // Debugging line to check the token value
    }
  return storedToken;
}
