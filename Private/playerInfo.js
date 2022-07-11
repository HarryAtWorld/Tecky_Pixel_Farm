window.onload = () => {
  loadInfo()
  loadRanking();

};

async function loadInfo() {
  const resp = await fetch('/userInfo')
  const data = await resp.json()
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