
<<<<<<< HEAD
window.onload = async () => {
    initLoginForm();
}
let form = document.querySelector('#reg');

form.addEventListener('click', () => {
    window.location.href = "./register.html";
    return;
});


function initLoginForm() {
    document.querySelector("#form-login").addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = e.target;
      const login_account = form.login_account.value;
      const login_password = form.login_password.value;
      const resp = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login_account, login_password }),
      });
      const result = await resp.json();
      if (!result.success) {
        alert(result.message);
        window.location.href =("./login.html");
    
      } else {
        // window.location.href = "/admin.html";
      }
    });
}
=======
let form = document.querySelector('login-form');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    return false;
});
>>>>>>> 7a6e735ce0176a3e79e8da1773bf874de8466dc9
