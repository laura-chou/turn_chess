import { pathName, getSkillInfo } from "../js/common.js";
import { getPlayerInfo, getEnemyInfo, setPlayerScore, setEnemyScore,
  getActivateSkill, setActivateSkill, setPerspective } from "../js/store.js";
import { timeTo } from "../js/timer.js";

let isPlayerMoveAgain = false;
let isEnemyMoveAgain = false;
let isActivateEnemySkill = getActivateSkill().enemy;

const setIsMoveAgain = (value, isPlayer = true) => {
  if (isPlayer) {
    isPlayerMoveAgain = value;
  } else {
    isEnemyMoveAgain = value;
  }
};

export { isPlayerMoveAgain, isEnemyMoveAgain, setIsMoveAgain };

export const activateSkill = (id, isPlayer = true) => {
  switch (id) {
    case 1:
      foresee(isPlayer);
      break;
    case 2:
      perspective();
      break;
    case 3:
      snoop();
      break;
    case 4:
      moveAgain();
      break;
    case 5:
      doubleElimination();
      break;
    case 6:
      stopPlayer();
      break;
    case 7:
      swapChess();
      break;
  }
};

const foresee = (isPlayer) => {
  openRandomChess(isPlayer);
};

const perspective = () => {
  const totalChess = $(".chess").length;
  const indices = [...Array(totalChess).keys()];
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const random4 = indices.slice(0, 4);

  random4.forEach((index, i) => {
    setTimeout(() => {
      playAudioEffect("flip");
      $(".chess").eq(index).addClass("perspective");
    }, i * 500);
  });

  setPerspective(random4);

  setTimeout(()=> {
    $(".chess").removeClass("disabled");
  }, 2250)
};

const snoop = () => {
  playAudioEffect("flip");
  $(".chess").addClass("open");
  setTimeout(()=>{
    $(".chess").removeClass("open");
  },1000);

  setTimeout(()=> {
    $(".chess").removeClass("disabled");
  }, 1250)
};

const moveAgain = () => {
  isPlayerMoveAgain = true;
  setTimeout(()=> {
    $(".chess").removeClass("disabled");
  }, 250)
};

const doubleElimination = () => {
  openRandomChess();
  setTimeout(() => {
    openRandomChess();
  }, 2500);
};

const stopPlayer = () => {
  isEnemyMoveAgain = true;
};

const swapChess = () => {
  const elements = $("td").toArray();
  const shuffledContents = elements
    .map(ele => $(ele).html())
    .sort(() => 0.5 - Math.random());

  elements.forEach((ele, index) => {
    $(ele).html(shuffledContents[index])
  });
};

const openRandomChess = (isPlayer = false) => {
  let numberArray = [];
  for (let i = 0; i < $(".chess").length; i++) {
    numberArray.push($(".chess").eq(i).data("chess"));
  }

  const duplicateChessIndex  = numberArray.reduce((acc, value, index) => {
    if (acc.found) return acc;
    if (acc.values.hasOwnProperty(value)) {
      acc.indices.push(...acc.values[value], index);
      acc.found = true;
    } else {
      acc.values[value] = [index];
    }
    return acc;
  }, { values: {}, indices: [], found: false}).indices;

  duplicateChessIndex.forEach((number, index) => {
    setTimeout(() => {
      playAudioEffect("flip");
      $(".chess").eq(number).addClass("foresee");
    }, (index + 1) * 500);
  });

  setTimeout(() => {
    playAudioEffect("offset");
    $(".foresee").fadeTo(1000, 0);
  }, 1250);

  setTimeout(() => {
    $(".foresee").remove();
    isPlayer ? setPlayerScore() : setEnemyScore();
  }, 2000);

  if (isPlayer) {
    setTimeout(()=> {
      $(".chess").removeClass("disabled");
    }, 2250)
  }
};

const validateSkillActivation = () => {
  const playerInfo = getPlayerInfo();
  const enemyInfo = getEnemyInfo();
  let delayTime = 0;
  let reBinding = false;
  let isActive = false;

  if (!isActivateEnemySkill) {
    switch (enemyInfo.skill) {
      case 1:
        if (playerInfo.score >= 3) {
          isActive = true;
          delayTime = 4000;
        }
        break;
      case 5:
        if (playerInfo.score >= 5) {
          isActive = true;
          delayTime = 6000;
        }
        break;
      case 6:
        if (playerInfo.score >= 4) {
          isActive = true;
          delayTime = 2500;
        }
        break;
      case 7:
        if (playerInfo.score + enemyInfo.score === 7) {
          isActive = true;
          delayTime = 2000;
          reBinding = true;
        }
        break;
    }
  }
  return { isActive: isActive, delayTime: delayTime, reBinding: reBinding };
};

export const activateEnemySkill = async () => {
  const enemyInfo = getEnemyInfo();
  const skillInfo = await getSkillInfo(enemyInfo.skill);
  const validate = validateSkillActivation();
  if (validate.isActive) {
    timeTo("stop");
    await Swal.fire({
      icon: "warning",
      title: `${enemyInfo.name}即將發動技能`,
      html: `<div class="skill-info">
              <p>技能:${skillInfo.skill}</p>
              <p>${skillInfo.desc}</p>
            </div>`,
      allowOutsideClick: false,
      confirmButtonText: "確定"
    }).then(() => {
      playAudioEffect("enemy-skill");
      showSkillEffect(enemyInfo.skill, false);
      setActivateSkill(false);
      isActivateEnemySkill = true;
      timeTo();
    });
  }
  return { delayTime: validate.delayTime, reBinding: validate.reBinding };
};

export const showSkillEffect = async (id, isPlayer = true) => {
  const index = isPlayer ? 0 : 1;
  const skillInfo = await getSkillInfo(id);
  $(".skill-name").eq(index).text(skillInfo.skill);
  $(".picture img").eq(index).addClass("disappear");
  $(".skill-name").eq(index).removeClass("disappear");
  var data = {
    in: { 
      effect: "bounceIn",
      callback: () => {
        $(".skill-name").eq(index).addClass("disappear")
        $(".picture img").eq(index).removeClass("disappear")
        activateSkill(id, isPlayer)
      }
    }
  };
  $(".skill-name").eq(index).textillate(data);
};

export const isGameOver = () => {
  return $(".chess").length == 0
}

export const playAudioEffect = (src) => {
  const audio = new Audio();
  audio.src = `${pathName}music/${src}.mp3`;
  audio.play();
};