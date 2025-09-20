import { getEnemyData, isNullOrEmpty } from "../js/common.js";

const domain = "https://game-api.up.railway.app";
const turnChessUrl = `${domain}/turn-chess`;

export const setStoreItem = (key, value) => {
  sessionStorage.setItem(key, value);
};

export const getStoreItem = (key) => {
  return sessionStorage.getItem(key);
};

export const getChessBoardStore = () => {
  const data = getStoreItem("chess-board");
  if (data == undefined) {
    return [];
  }
  return data.split(",").map(Number);
};

export const setChessBoardStore = () => {
  let chessData = [];
  for (let i = 0; i < $("td").length; i++) {
    const chessElement = $("td").eq(i).find(".chess");
    const data = chessElement.length > 0
                ? chessElement.data("image")
                : 0;
    chessData.push(data);
  }
  setStoreItem("chess-board", chessData.toString());
};

export const getPlayerInfo = () => {
  return JSON.parse(getStoreItem("chess-player"));
};

export const setPlayerInfo = (id, name) => {
  const player = {
    id: parseInt(id),
    name: name,
    score: 0
  };
  setStoreItem("chess-player", JSON.stringify(player));
};

export const setPlayerScore = () => {
  let playerInfo = getPlayerInfo();
  playerInfo.score++;
  $(".score span").eq(0).text(playerInfo.score);
  setStoreItem("chess-player", JSON.stringify(playerInfo));
};

export const getEnemyInfo = () => {
  return JSON.parse(getStoreItem("chess-enemy"));
};

export const setEnemyInfo = (id) => {
  const data = getEnemyData(id);
  const enemyInfo = {
    id: id,
    name: data.name,
    score: 0,
    skill: data.skill,
    message: data.message
  };
  setStoreItem("chess-enemy",  JSON.stringify(enemyInfo));
};

export const setEnemyScore = () => {
  let enemyInfo = getEnemyInfo();
  enemyInfo.score++;
  $(".score span").eq(1).text(enemyInfo.score);
  setStoreItem("chess-enemy", JSON.stringify(enemyInfo));
};

export const getTime = () => {
  return getStoreItem("time");
};

export const setTime = (value) => {
  setStoreItem("time", value);
};

export const getActivateSkill = () => {
  return JSON.parse(getStoreItem("activate-skill"));
};

export const setActivateSkill = (isPlayer) => {
  let activateSkill = getActivateSkill();
  if (activateSkill == undefined) {
    activateSkill = { player: false, enemy: false };
  } else {
    if (isPlayer) {
      activateSkill.player = true;
    } else {
      activateSkill.enemy = true;
    }
  }

  setStoreItem("activate-skill", JSON.stringify(activateSkill));
};

export const getAction = () => {
  return JSON.parse(getStoreItem("action"));
};

export const setAction = (isPlayer) => {
  setStoreItem("action", isPlayer);
};

export const getOpenChess = () => {
  const data = getStoreItem("open-chess");
  if (data == undefined || isNullOrEmpty(data)) {
    return [];
  }
  return data.split(",").map(Number);
};

export const setOpenChess = (openChess = []) => {
  setStoreItem("open-chess", openChess.toString());
};

export const getTopFivePlayers = () => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${turnChessUrl}/top5`,
      method: "GET",
      dataType: "json",
      success: function (response) {
        resolve(response.data)
      },
      error: function (xhr, ajaxOptions, thrownError) {
        resolve(null)
      }
    });
  });
};

export const getAllPlayers = () => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: turnChessUrl,
      method: "GET",
      dataType: "json",
      success: function (response) {
        resolve(response.data)
      },
      error: function (xhr, ajaxOptions, thrownError) {
        resolve(null)
      }
    });
  });
};

export const insertPlayer = (message) => {
  return new Promise((resolve, reject) => {
    const player = getPlayerInfo();
    const data = {
      character: player.id,
      player: player.name,
      score: player.score,
      spentTime: getTime(),
      message: message
    };
    $.ajax({
      url: `${turnChessUrl}/create`,
      method: "POST",
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify(data),
      success: function (response) {
        resolve(response)
      },
      error: function (xhr, ajaxOptions, thrownError) {
        resolve(null)
      }
    });
  });
};

export const connectServer = () => {
  setStoreItem("connect", false);
  return new Promise((resolve, reject) => {
    $.ajax({
      url: domain,
      method: "GET",
      success: function () {
        setStoreItem("connect", true)
        resolve(true)
      },
      error: function () {
        resolve(false)
      }
    });
  });
};

export const isPlayerExist = () => {
  return getPlayerInfo() != undefined;
};

export const removeStorage = () => {
  sessionStorage.removeItem("action");
  sessionStorage.removeItem("activate-skill");
  sessionStorage.removeItem("chess-board");
  sessionStorage.removeItem("chess-enemy");
  sessionStorage.removeItem("chess-player");
  sessionStorage.removeItem("open-chess");
  sessionStorage.removeItem("time");
  sessionStorage.removeItem("connect");
};