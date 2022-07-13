
window.onload = () => {

  loadRanking();
  loadSgFriends();

};



async function loadRanking() {
  const resp = await fetch("/friendRank");
  console.log(`passed fetch, ${resp}`);
  const datas = await resp.json();
  let htmlStr = "";
  let i = 1
  for (const data of datas) {
    htmlStr += /*html*/ `
<<<<<<< HEAD
      <tr id=${data.user_id} class="friends">
=======
      <tr>
>>>>>>> e4bc26ede69a6f49664f16e11ff0c6fe868cc697
      <td class="rank">${i}</td>
      <td class="name">${data.user_name}</td>
      <td class="score">${data.score}</td>
      </tr>
      `;
    i++
  }
  document.querySelector("#rankTable").innerHTML = htmlStr;
<<<<<<< HEAD
  addTRClickEvent()
}



async function loadSgFriends() {
  const resp = await fetch("/friendRank");
  console.log(`passed fetch, ${resp}`);
  const datas = await resp.json();
  let htmlStr = "";

  for (const data of datas) {
    htmlStr += /*html*/ `
      <tr id=${data.user_id} class="suggest-friends">
=======
}

async function loadSgFriends() {
  const resp = await fetch("/friendRank");
  console.log(`passed fetch, ${resp}`);
  const datas = await resp.json();
  let htmlStr = "";

  for (const data of datas) {
    htmlStr += /*html*/ `
      <tr>
>>>>>>> e4bc26ede69a6f49664f16e11ff0c6fe868cc697
      <td class="ID">${data.user_id}</td>
      <td class="name">${data.user_name}</td>
      <td></td>
      </tr>
      `;
  }
  document.querySelector("#SgFriendsTable").innerHTML = htmlStr;
<<<<<<< HEAD
  addTRClickEvent()
}


async function addTRClickEvent(){
  document.querySelectorAll("tr").forEach(
    elem => { 
      elem.addEventListener("click", async (e) => {
        e.preventDefault();
        // console.log("target.id: ", e.currentTarget.getAttribute("id"));
        const user_id = e.currentTarget.getAttribute("id");
        
        // const user_name = form.changeUsername.value;
        console.log(user_id);
  
        const resp = await fetch("/name", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id }),
  
        });
        const result = await resp.json();
        if (!result.success) {
          alert(result.message);
  
  
        } else {
          alert(result.message);
          window.location.href = "./editProfile.html";
        }
      })
    }
  )
}
  ;
=======
}
>>>>>>> e4bc26ede69a6f49664f16e11ff0c6fe868cc697

