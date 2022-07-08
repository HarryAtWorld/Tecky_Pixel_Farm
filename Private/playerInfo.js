window.onload = () => {

    loadRanking();
    
  };
 


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