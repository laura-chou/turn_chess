const getMorePlayers = (players) => {
  if (players.length > 0) {
    let html = "";
    for (const player of players) {
      html += `<div class="player mt-2">
                <img src="../images/player${player.character}.png" data-bs-toggle="popover" data-bs-placement="right" data-bs-content="${player.message}"/>
                <span>${player.player}</span>
              </div>`;
    }
    return `<button class="accordion">
              <i class="fa-solid fa-angle-up"></i>
            </button>
            <div class="more">${html}</div>`;
  }
  return "";
};

const getRank = (rank) => {
  return rank == 1 ? `<i class="fa-solid fa-trophy trophy"></i>` : rank;
};

const getClass = (rank) => {
  return rank == 1 ? "top1" : "";
};

const getPlayerHtml = (players) => {
  return `<div class="player">
            <img src="../images/player${players[0].character}.png" data-bs-toggle="popover" data-bs-placement="right" data-bs-content="${players[0].message}"/>
            <span>${players[0].player}</span>
          </div>
          ${getMorePlayers(players.slice(1))}`;
};

const getInfoHtml = (datas) => {
  let info = "";
  if (datas.length > 0) {
    for (const data of datas) {
      info += `<tr class="${getClass(data.rank)}">
                <td>${getRank(data.rank)}</td>
                <td style="position:relative;">
                  ${getPlayerHtml(data.players)}
                </td>
                <td>${data.spentTime}</td>
              </tr>`;
    }
  }
  return info;
};

export const getRankHtml = (data) => {
  const html = (data.length === 0) ? `<tr><td colspan="3">暫無玩家</td></tr>` : getInfoHtml(data);
  return `<table class="table" style="margin-top: 6px">
            <thead>
              <tr>
                <th>排名</th>
                <th>姓名</th>
                <th>花費時間</th>
              </tr>
            </thead>
            <tbody>${html}</tbody>
          </table>`;
};