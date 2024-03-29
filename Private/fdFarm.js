
window.onload = () => {

  loadRanking();
  loadSgFriends();

};



async function loadRanking() {
  const resp = await fetch("/friendRank");
  console.log(`passed fetch, ${resp}`);
  const datas = await resp.json();

  function compare(a, b) {
    if (a.score < b.score) {
      return 1;
    }
    if (a.score > b.score) {
      return -1;
    } return 0;
  }
  datas.sort(compare)

  let htmlStr = "";
  let i = 1
  for (const data of datas) {
    htmlStr += /*html*/ `
      <tr id=${data.user_id} class="friends">
      <td class="rank">${i}</td>
      <td class="name">${data.user_name}</td>
      <td class="score">${data.score}</td>
      </tr>
      `;
    i++
  }
  document.querySelector("#rankTable").innerHTML = htmlStr;
  addTRClickEvent()
}



async function loadSgFriends() {
  const resp = await fetch("/friendSuggestion");
  console.log(`passed fetch, ${resp}`);
  const datas = await resp.json();
  let htmlStr = "";

  for (const data of datas) {
    htmlStr += /*html*/ `
      <tr id=${data.id} class="suggest-friends">
      <td class="ID">${data.id}</td>
      <td class="name">${data.user_name}</td>
      <td></td>
      </tr>
      `;
  }
  document.querySelector("#SgFriendsTable").innerHTML = htmlStr;
  // addTRClickEvent()
}


async function addTRClickEvent() {
  document.querySelectorAll("tr.friends").forEach(
    elem => {
      elem.addEventListener("click", async (e) => {
        e.preventDefault();
        // console.log("target.id: ", e.currentTarget.getAttribute("id"));
        const user_id = e.currentTarget.getAttribute("id");

        // const user_name = form.changeUsername.value;
        console.log(user_id);
        const resp = await fetch("/friendFarm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id }),

        });
        const result = await resp.json();
        // console.log(resp.status)

        window.location.href = "./fdGame.html";
        if (resp.status == 200) {
          window.location.href = "./fdGame.html";
        } else {
          window.location.href = "./fdFarm.html";
        }


      })
    }
  )
}
;

