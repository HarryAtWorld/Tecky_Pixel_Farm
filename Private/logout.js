window.onload = async () => {
    Logout();
  }

  function Logout() {
    document.querySelector("#logout").addEventListener("submit", async (e) => {
      e.preventDefault();
      const resp = await fetch("/logout", {       
      });
      const result = await resp.json();
      if (result.success) {
        alert(result.message);
        window.location.href = "./index.html";
  
      }
    });
  }
