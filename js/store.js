import { getEnemyData } from "../js/common.js"
const domain = "http://localhost:3000"

export const getChessBoardStore = () => {
  const data = getStoreItem("chess-board")
  if (data == undefined) {
    return []
  }
  return data.split(",").map(Number)
}

export const setChessBoardStore = () => {
  let chessData = []
  for (let i = 0; i < $("td").length; i++) {
    const chessElement = $("td").eq(i).find(".chess")
    const data = chessElement.length > 0
                ? chessElement.data("image")
                : 0
    chessData.push(data)
  }
  setStoreItem("chess-board", chessData.toString())
}

export const getPlayerInfo = () => {
  return JSON.parse(getStoreItem("chess-player"))
}

export const setPlayerInfo = (id, name) => {
  const player = {
    id: parseInt(id),
    name: name,
    score: 0
  }
  setStoreItem("chess-player", JSON.stringify(player))
}

export const setPlayerScore = () => {
  let playerInfo = getPlayerInfo()
  playerInfo.score++
  $(".score span").eq(0).text(playerInfo.score)
  setStoreItem("chess-player", JSON.stringify(playerInfo))
}

export const getEnemyInfo = () => {
  return JSON.parse(getStoreItem("chess-enemy"))
}

export const setEnemyInfo = (id) => {
  const data = getEnemyData(id)
  const enemyInfo = {
    id: id,
    name: data.name,
    score: 0,
    skill: data.skill,
    message: data.message
  }
  setStoreItem("chess-enemy",  JSON.stringify(enemyInfo))
}

export const setEnemyScore = () => {
  let enemyInfo = getEnemyInfo()
  enemyInfo.score++
  $(".score span").eq(1).text(enemyInfo.score)
  setStoreItem("chess-enemy", JSON.stringify(enemyInfo))
}

export const getTime = () => {
  return getStoreItem("time")
}

export const setTime = (value) => {
  setStoreItem("time", value)
}

export const getActivateSkill = () => {
  return JSON.parse(getStoreItem("activate-skill"))
}

export const setActivateSkill = (isPlayer) => {
  let activateSkill = getActivateSkill()
  if (activateSkill == undefined) {
    activateSkill = { player: false, enemy: false }
  } else {
    if (isPlayer) {
      activateSkill.player = true
    } else {
      activateSkill.enemy = true
    }
  }

  setStoreItem("activate-skill", JSON.stringify(activateSkill))
}

export const getAction = () => {
  return JSON.parse(getStoreItem("action"))
}

export const setAction = (isPlayer) => {
  setStoreItem("action", isPlayer)
}

export const getOpenChess = () => {
  const data = getStoreItem("open-chess")
  if (data == undefined) {
    return []
  }
  return data.split(",").map(Number)
}

export const setOpenChess = (openChess = []) => {
  setStoreItem("open-chess", openChess.toString())
}

export const setStoreItem = (key, value) => {
  sessionStorage.setItem(key, value)
}

export const getStoreItem = (key) => {
  return sessionStorage.getItem(key)
}