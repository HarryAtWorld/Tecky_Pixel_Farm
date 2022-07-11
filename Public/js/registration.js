
window.onload = async () => {
  initRegisterForm();
}


function initRegisterForm() {
  document.querySelector("#form-register").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const user_name = form.user_name.value;
    const login_account = form.login_account.value;
    const login_password = form.login_password.value;
    const resp = await fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_name, login_account, login_password }),
    });
    const result = await resp.json();
    if (!result.success) {
      alert(result.message);
      window.location.href =("./registration.html");
  
    } else {
     alert(result.message);
      window.location.href = "./login.html";
    }
  });
}