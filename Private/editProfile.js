window.onload = async () => {
  loadUserName();
  initChangeUserName();
  initChangePassWord();
}

async function loadUserName() {
  const resp = await fetch('/userInfo')
  const data = await resp.json()
  let htmlStr = "";
  htmlStr += `<h2>${data.user_name}</h2>`;
  document.querySelector("#h5").innerHTML = htmlStr;
}

function initChangeUserName() {
  document.querySelector("#form-name").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const user_name = form.changeUsername.value;
    console.log(user_name);

    const resp = await fetch("/name", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_name }),
    });
    const result = await resp.json();
    if (!result.success) {
      alert(result.message);


    } else {
      alert(result.message);

    }
  });
  const result = await resp.json();
  if (!result.success) {
    alert(result.message);


  } else {
    alert(result.message);

  };
}

function initChangePassWord() {
  document.querySelector("#form-password").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const login_password = form.changePassword.value;

    const resp = await fetch("/password", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ login_password }),
    });
    const result = await resp.json();
    if (!result.success) {
      alert(result.message);


    } else {
      alert(result.message);

    }
  });
}


