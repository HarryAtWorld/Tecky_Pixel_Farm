
window.onload = () => {
  loadRanking();
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

  console.log(datas)
  let htmlStr = "";
  let i = 1
  for (const data of datas) {
    htmlStr += /*html*/ `
      <tr>
      <td class="rank">${i}</td>
      <td class="name">${data.user_name}</td>
      <td class="score">${data.score}</td>
      </tr>
      `;
    i++
  }
  document.querySelector("#rankTable").innerHTML = htmlStr;
}

