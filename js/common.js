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

export const accordionEffect = (element) => {
  element.classList.toggle("active");
  let state = "up"
  const angleElement = element.querySelector("i.fa-solid");
  const panel = element.nextElementSibling;
  if (panel.style.maxHeight) {
    panel.style.maxHeight = null;
  } else {
    panel.style.maxHeight = panel.scrollHeight + "px";
    state = "down"
  } 
  $(angleElement).attr("class", `fa-solid fa-angle-${state}`)
}

export const convertToBool = (value) => {
  if (!value) {
    return false
  }
  return value.toLowerCase() === "true" || value === "1"
}

export const redirectToHome  = () => {
  removeStorage();
  window.location.href = pathName;
};

export const serverError = async () => {
  await Swal.fire({
    icon: "error",
    title: "伺服器錯誤",
    html: `<h3 style="margin:0;">請稍後再試</h3>`,
    timer: 3000,
    showConfirmButton: false,
    allowOutsideClick: false,
    willClose: () => {
      removeStorage();
      window.location.href = pathName;
    }
  });
};

export const removeStorage = () => {
  // sessionStorage.removeItem("process");
  // sessionStorage.removeItem("time");
  // sessionStorage.removeItem("lotto");
  // sessionStorage.removeItem("clock");
  // sessionStorage.removeItem("wallet");
}