const getPathName = () => {
  let path = '/'
  if (window.location.pathname.includes('turn_chess')) {
    path = '/turn_chess/'
  }
  return path
}

export const pathName = getPathName()

const readJsonFile = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

const randNumber = (max) => {
  const min = 1
  const random = Math.random() * (max - min) + min;
  return Math.round(random)
}

export const randNumberWithMin = (min, max) => {
  const random = Math.random() * (max - min) + min;
  return Math.round(random)
}

const enemyInfo =  await readJsonFile(`${getPathName()}json/enemyInfo.json`);

export const getRandEnemy = () => {
  return randNumber(enemyInfo.length)
}

export const getEnemyData = (id) => {
  return enemyInfo.find(info => info.id === parseInt(id))
}

export const getSkillInfo = async (id) => {
  const data = await readJsonFile(`${getPathName()}json/skillInfo.json`);
  return data.find(info => info.id === id)
}