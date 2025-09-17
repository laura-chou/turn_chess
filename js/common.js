import { removeStorage } from "./store.js";

const getPathName = () => {
  let path = "/";
  if (window.location.pathname.includes("turn_chess")) {
    path = "/turn_chess/";
  }
  return path;
}

export const pathName = getPathName();

const readJsonFile = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
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
  return Math.round(random);
};

export const randNumberWithMin = (min, max) => {
  const random = Math.random() * (max - min) + min;
  return Math.round(random);
};

const enemyInfo =  await readJsonFile(`${getPathName()}json/enemyInfo.json`);

export const getRandEnemy = () => {
  return randNumber(enemyInfo.length);
};

export const getEnemyData = (id) => {
  return enemyInfo.find(info => info.id === parseInt(id));
};

export const getSkillInfo = async (id) => {
  const data = await readJsonFile(`${getPathName()}json/skillInfo.json`);
  return data.find(info => info.id === id);
};

export const accordionEffect = (element) => {
  element.classList.toggle("active");
  let state = "up";
  const angleElement = element.querySelector("i.fa-solid");
  const panel = element.nextElementSibling;
  if (panel.style.maxHeight) {
    panel.style.maxHeight = null;
  } else {
    panel.style.maxHeight = panel.scrollHeight + "px";
    state = "down";
  } 
  $(angleElement).attr("class", `fa-solid fa-angle-${state}`);
};

export const isNullOrEmpty = (value) => {
  if (value == null) {
    return true;
  }
  return value.trim().length === 0;
};

export const convertToBool = (value) => {
  if (!value) {
    return false;
  }
  return value.toLowerCase() === "true" || value === "1";
};

export const redirectToHome  = (isRedirect = true) => {
  removeStorage();
  if (isRedirect) {
    window.location.href = pathName;
  }
};

export const serverError = async (isRedirect) => {
  await Swal.fire({
    icon: "error",
    title: "伺服器錯誤",
    html: `<h3 style="margin:0;">請稍後再試</h3>`,
    timer: 3000,
    showConfirmButton: false,
    allowOutsideClick: false,
    willClose: () => {
      removeStorage()
      redirectToHome(isRedirect)
    }
  });
};

export const activePopover = () => {
  const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
  popoverTriggerList.forEach(function (popoverTriggerEl) {
    new bootstrap.Popover(popoverTriggerEl);
  });
};

export const hidePopover = () => {
  const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
  popoverTriggerList.forEach(function (popoverTriggerEl) {
    const instance = bootstrap.Popover.getInstance(popoverTriggerEl);
    if (instance) instance.hide();
  });
}
