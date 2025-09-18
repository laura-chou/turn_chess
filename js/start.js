import { randNumberWithMin, getSkillInfo } from "../js/common.js";
import { getPlayerInfo, getEnemyInfo, setPlayerScore, setEnemyScore, getActivateSkill, setActivateSkill } from "../js/store.js";

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
  let random4 = [];
  while(random4.length < 4){
    const randNum = randNumberWithMin(0, $('.chess').length - 1);
    
    if (random4.includes(randNum)) {
      continue;
    }
    
    const ele = $('.chess').eq(randNum);
    if (ele.hasClass('perspective')) {
      continue;
    }
    
    random4.push(randNum);

    setTimeout(() => {
      $('.chess').eq(randNum).addClass('perspective');
    }, random4.length * 500);
  }

  setTimeout(()=> {
    $(".chess").removeClass("disabled");
  }, 2250)
};

const snoop = () => {
  $('.chess').addClass('open');
  setTimeout(()=>{
    $('.chess').removeClass('open');
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
  const elements = $('td').toArray();
  const shuffledContents = elements
    .map(ele => $(ele).html())
    .sort(() => 0.5 - Math.random());

  elements.forEach((ele, index) => {
    $(ele).html(shuffledContents[index])
  });
};

const openRandomChess = (isPlayer = false) => {
  let numberArray = [];
  for (let i = 0; i < $('.chess').length; i++) {
    numberArray.push($('.chess').eq(i).data('chess'));
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
      $('.chess').eq(number).addClass('foresee');
    }, (index + 1) * 500);
  });

  setTimeout(() => {
    $('.foresee').fadeTo(1000, 0);
  }, 1250);

  setTimeout(() => {
    $('.foresee').remove();
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
        if (playerInfo.score >= 1) {
          isActive = true;
          delayTime = 4000;
        }
        break;
      case 5:
        if (playerInfo.score >= 3) {
          isActive = true;
          delayTime = 5500;
        }
        break;
      case 6:
        if (playerInfo.score >= 2) {
          isActive = true;
          delayTime = 2500;
        }
        break;
      case 7:
        if (playerInfo.score + enemyInfo.score === 5) {
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
    await Swal.fire({
      title: `${enemyInfo.name}即將發動技能`,
      html: `<div class='skill-info'>
              <p>技能:${skillInfo.skill}</p>
              <p>${skillInfo.desc}</p>
            </div>`,
      icon: 'warning',
      allowOutsideClick: false,
      confirmButtonText: '確定'
    }).then(() => {
      showSkillEffect(enemyInfo.skill, false);
      setActivateSkill(false);
      isActivateEnemySkill = true;
    });
  }
  return { delayTime: validate.delayTime, reBinding: validate.reBinding };
};

export const showSkillEffect = async (id, isPlayer = true) => {
  const index = isPlayer ? 0 : 1;
  const skillInfo = await getSkillInfo(id);
  $('.skill-name').eq(index).text(skillInfo.skill);
  $('.picture img').eq(index).addClass("disappear");
  $('.skill-name').eq(index).removeClass("disappear");
  var data = {
    in: { 
      effect: "bounceIn",
      callback: () => {
        $('.skill-name').eq(index).addClass("disappear")
        $('.picture img').eq(index).removeClass("disappear")
        activateSkill(id, isPlayer)
      }
    }
  };
  $('.skill-name').eq(index).textillate(data);
};