import { pathName } from "./common.js";

const getRank = (rank) => {
  return rank == 1 ? `<i class="fa-solid fa-trophy trophy"></i>` : rank;
};

const getClass = (rank) => {
  return rank == 1 ? "top1" : "";
};

const getMorePlayers = (players, showScore) => {
  if (players.length > 0) {
    let html = "";
    for (const player of players) {
      const scoreField = showScore ? ` (${player.score})` : "";
      const imgPath = showScore ? "/" : pathName;
      html += `<div class="player mt-2">
                <img src="..${imgPath}images/player${player.character}.png" data-bs-toggle="popover" data-bs-placement="right" data-bs-content="${player.message}"/>
                <span>${player.player}${scoreField}</span>
              </div>`;
    }
    return `<button class="accordion">
              <i class="fa-solid fa-angle-up"></i>
            </button>
            <div class="more">${html}</div>`;
  }
  return "";
};

const getPlayerHtml = (players, showScore) => {
  const scoreField = showScore ? ` (${players[0].score})` : "";
  const imgPath = showScore ? "/" : pathName;
  return `<div class="player">
            <img src="..${imgPath}images/player${players[0].character}.png" data-bs-toggle="popover" data-bs-placement="right" data-bs-content="${players[0].message}"/>
            <span>${players[0].player}${scoreField}</span>
          </div>
          ${getMorePlayers(players.slice(1), showScore)}`;
};

const getInfoHtml = (datas, showScore) => {
  let info = "";
  if (datas.length > 0) {
    for (const data of datas) {
      info += `<tr class="${getClass(data.rank)}">
                <td>${getRank(data.rank)}</td>
                <td style="position:relative;">
                  ${getPlayerHtml(data.players, showScore)}
                </td>
                <td>${data.spentTime}</td>
              </tr>`;
    }
  }
  return info;
};

export const getRankHtml = (data) => {
  return `<table class="table">
            <thead>
              <tr>
                <th>排名</th>
                <th>姓名 (分數)</th>
                <th>時間</th>
              </tr>
            </thead>
            <tbody>${getInfoHtml(data, true)}</tbody>
          </table>`;
};

export const getTopRankHtml = (data) => {
  const html = (data.length === 0) ? `<tr><td colspan="3">暫無玩家</td></tr>` : getInfoHtml(data, false);
  return `<table class="table">
            <thead>
              <tr>
                <th>排名</th>
                <th>姓名</th>
                <th>時間</th>
              </tr>
            </thead>
            <tbody>${html}</tbody>
          </table>`;
};