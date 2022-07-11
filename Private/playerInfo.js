window.onload = () => {
  loadUserName();
  loadRanking();
  loadUserID();
  loadUserName2();
  loadUserEmail();
  addFriends();
};

async function loadUserName() {
  const resp = await fetch('/userInfo')
  const data = await resp.json()
  let htmlStr = "";
  htmlStr += `<h2>Hello!  ${data.user_name}</h2>`;
  document.querySelector("#h5").innerHTML = htmlStr;
  console.log(data.id)
  console.log(data.user_name)
  console.log(data.login_account)
}


async function loadRanking() {
  const resp = await fetch("/friendRank");
  console.log(`passed fetch, ${resp}`);
  const datas = await resp.json();
  let htmlStr = "";
  let i = 1
  for (const data of datas) {
    htmlStr += /*html*/ `
      <div>${data.user_name}</div>
      `;
    i++
  }
  document.querySelector(".profile-work").innerHTML = htmlStr;
}

async function loadUserID() {
  const resp = await fetch('/userInfo')
  const data = await resp.json()
  let htmlStr = "";
  htmlStr += `<p>${data.id}</p>`;
  document.querySelector("#col6id").innerHTML = htmlStr;
}

async function loadUserName2() {
  const resp = await fetch('/userInfo')
  const data = await resp.json()
  let htmlStr = "";
  htmlStr += `<p>${data.user_name}</p>`;
  document.querySelector("#col6name").innerHTML = htmlStr;
}

async function loadUserEmail() {
  const resp = await fetch('/userInfo')
  const data = await resp.json()
  let htmlStr = "";
  htmlStr += `<p>${data.login_account}</p>`;
  document.querySelector("#col6email").innerHTML = htmlStr;
}

function addFriends() {
  document.querySelector("#addfriends").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const friendName = form.friendName.value;
    console.log(friendName);
    
    const resp = await fetch("/friend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ friendName }),
    });
    const result = await resp.json();
    if (!result.success) {
      alert(result.message);
      window.location.href =("./playerInfo.html");
  
    } else {
     alert(result.message);
      window.location.href = "./playerInfo.html";
    }
  });
}