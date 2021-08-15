import rovers from "../config.js";
document.addEventListener("DOMContentLoaded", function () {
  const selectorCarousel = document.querySelector(".carousel .gallery");
  function createSelectors(list = [], images = []) {
    if (list.length < 1) {
      return images;
    }
    const current = list[0];
    const image = document.createElement("DIV");
    image.setAttribute("id", current.name.toLowerCase());
    image.classList.add("illustration");
    image.style.backgroundImage = 'url("' + current.image + '")';
    images.push(image);
    selectorCarousel.appendChild(image);
    const descLeft = document.createElement("DIV");
    descLeft.textContent = "Rover";
    const descRight = document.createElement("DIV");
    descRight.textContent = `${current.name}`;
    descLeft.classList.add("left");
    descRight.classList.add("right");
    image.appendChild(descLeft);
    image.appendChild(descRight);
    return createSelectors(list.slice(1), images);
  }
  if (selectorCarousel) {
    const selectors = createSelectors(rovers);
    let marginLeft = 0;
    let countRight = 0;
    const navLeft = document.querySelector(".carousel .nav-left .nav");
    const navRight = document.querySelector(".carousel .nav-right .nav");

    const showOrHideNav = function () {
      if (countRight <= 0) {
        navLeft.style.opacity = -1;
        navLeft.style.zIndex = -1;
        navLeft.style.display = "none";
      } else {
        navLeft.style.opacity = 0.6;
        navLeft.style.zIndex = 1;
        navLeft.style.display = "inline-block";
      }
      if (countRight >= selectors.length - 1) {
        navRight.style.opacity = -1;
        navRight.style.zIndex = -1;
        navRight.style.display = "none";
      } else {
        navRight.style.opacity = 0.6;
        navRight.style.zIndex = 1;
        navRight.style.display = "inline-block";
      }
    };

    const shiftRight = function () {
      marginLeft -= 100;
      countRight++;
    };
    const shiftLeft = function () {
      marginLeft += 100;
      countRight--;
    };
    showOrHideNav();
    navRight.addEventListener("click", function () {
      shiftRight();
      selectorCarousel.style.marginLeft = `calc(${marginLeft}%)`;
      showOrHideNav();
    });
    navLeft.addEventListener("click", function () {
      shiftLeft();
      selectorCarousel.style.marginLeft = `calc(${marginLeft}%)`;
      showOrHideNav();
    });
  }
});
