document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('carousel_track');
  const btnRight = document.getElementById('carousel_right_chevron');
  const btnLeft  = document.getElementById('carousel_left_chevron');

  let currentPage = 0;

  function computeSizes() {
      const tiles = track.querySelectorAll('.tile');
      if (!tiles.length) return null;

      const gap = parseFloat(getComputedStyle(track).gap || '20');
      const tileWidth = tiles[0].getBoundingClientRect().width;

      const tilesPerPage = 3;
      const pageWidth = tilesPerPage * tileWidth + (tilesPerPage - 1) * gap;

      const totalPages = Math.ceil(tiles.length / tilesPerPage);

      return { tileWidth, gap, pageWidth, totalPages };
  }

  function goToPage(pageIndex) {
      const sizes = computeSizes();
      if (!sizes) return;

      currentPage = Math.max(0, Math.min(pageIndex, sizes.totalPages - 1));

      const tiles = track.querySelectorAll('.tile');
    const firstTileOfPage = tiles[currentPage * 3];

if (firstTileOfPage) {
    const offset = -firstTileOfPage.offsetLeft;
    track.style.transform = `translateX(${offset}px)`;
} 
  }

  function slideRight() {
      goToPage(currentPage + 1);
  }

  function slideLeft() {
      goToPage(currentPage - 1);
  }

  btnRight.addEventListener('click', slideRight);
  btnLeft.addEventListener('click', slideLeft);

  window.addEventListener('resize', () => {
      goToPage(currentPage);
  });
});


// ------------------------------
// Hover Mechanics
// ------------------------------

const tiles = document.querySelectorAll(".tile");

function applyHoverState(tile) {
  tile.classList.add("tile-hover");
  tile.querySelector(".tile_chevron")?.classList.add("chevron-hover");
  tile.querySelector(".tile_headings")?.classList.add("tile-headings-hover");
  tile.querySelector(".number_container")?.classList.add("number-container-hover");
  tile.querySelector(".number_container p")?.classList.add("number-container-hover");
  tile.querySelector(".tile_content_descriptions")?.classList.add("tile_content_descriptions_hover");
  tile.querySelector(".overlay")?.classList.add("overlay-hover");
  tile.querySelector(".tile_img")?.classList.add("tile_img_hover");
  tile.querySelector(".overlay-accent")?.classList.add("overlay-accent-hover");
  tile.querySelector(".information-icon")?.classList.add("information-icon-hover");
}

function removeHoverState(tile) {
  tile.classList.remove("tile-hover");
  tile.querySelector(".tile_chevron")?.classList.remove("chevron-hover");
  tile.querySelector(".tile_headings")?.classList.remove("tile-headings-hover");
  tile.querySelector(".number_container")?.classList.remove("number-container-hover");
  tile.querySelector(".number_container p")?.classList.remove("number-container-hover");
  tile.querySelector(".tile_content_descriptions")?.classList.remove("tile_content_descriptions_hover");
  tile.querySelector(".overlay")?.classList.remove("overlay-hover");
  tile.querySelector(".tile_img")?.classList.remove("tile_img_hover");
  tile.querySelector(".overlay-accent")?.classList.remove("overlay-accent-hover");
  tile.querySelector(".information-icon")?.classList.remove("information-icon-hover");
}

let lockedTile = null; // NEW — tracks which tile is "locked open"

tiles.forEach(tile => {
  const chevron = tile.querySelector(".tile_chevron");
  const tileHeading = tile.querySelector(".tile_headings");
  const numberContainer = tile.querySelector(".number_container");
  const numberContainerNumber = tile.querySelector(".number_container p");
  const tileContentDescriptions = tile.querySelector(".tile_content_descriptions");
  const overlay = tile.querySelector(".overlay");
  const tileImg = tile.querySelector(".tile_img");
  const overlayAccent = tile.querySelector(".overlay-accent");

  // Normal hover behavior
  tile.addEventListener("mouseenter", () => {
    if (lockedTile !== tile) {
      applyHoverState(tile);
    }
  });

  tile.addEventListener("mouseleave", () => {
    if (lockedTile !== tile) {
      removeHoverState(tile);
    }
  });
});


// ------------------------------
// Accordion + Chevron Click Logic
// ------------------------------

const connectingLine = document.querySelectorAll(".tile_line_bottom");
const tileChevron = document.querySelectorAll(".tile_chevron");
const accordionLine = document.getElementById("accordion_line");
const accordionContent = document.querySelectorAll(".accordion_content");

let openIndex = null;

tileChevron.forEach(chev => {
  chev.classList.add("is-down");
});

tileChevron.forEach((chev, index) => {
  chev.addEventListener("click", () => {

    const tile = tiles[index];

    // ------------------------------
    // NEW: Persistent Hover Logic
    // ------------------------------

    const isSameTile = lockedTile === tile;

    if (isSameTile) {
      removeHoverState(tile);
      lockedTile = null;
    } else {
      if (lockedTile) removeHoverState(lockedTile);
      applyHoverState(tile);
      lockedTile = tile;
    }

    // ------------------------------
    // Existing Accordion Logic
    // ------------------------------

    const isDown = chev.classList.toggle("is-down");

    chev.classList.add("fading");

    setTimeout(() => {

      chev.innerHTML = isDown
        ? `
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
               stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>`
        : `
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
               stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="m4.5 15.75 7.5-7.5 7.5 7.5" />
          </svg>`;

      tileChevron.forEach((otherChev, i) => {
        if (i !== index) {
          otherChev.classList.add("is-down");
          otherChev.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          `;
        }
      });

      accordionContent.forEach(content => content.classList.remove("open"));

      if (isSameTile && isDown) {
        connectingLine.forEach(line => line.style.width = "100%");
        accordionLine.style.opacity = "0";
        accordionLine.style.transform = "translateY(0)";
        openIndex = null;
      }

      else if (!isDown) {

        connectingLine.forEach(line => line.style.width = "100%");
        accordionLine.style.opacity = "0";
        accordionLine.style.transform = "translateY(0)";

        setTimeout(() => {

          connectingLine.forEach(line => line.style.width = "150%");
          accordionLine.style.opacity = "1";
          accordionLine.style.transform = "translateY(300px)";

          accordionContent[index].classList.add("open");

        }, 300);

        openIndex = index;
      }

      chev.classList.remove("fading");

    }, 250);
  });
});


const informationIcon = document.querySelectorAll(".information-icon");
const tileLineInformation = document.querySelectorAll(".tile-line-information");
const informationTopLine = document.getElementById("information-top-line");
const informationIconTxt = document.querySelector(".information-icon-txt");

informationIcon.forEach((icon) => {
  icon.addEventListener("click", () => {

    const isClicked = icon.classList.contains("clicked");

    // Toggle clicked class
    icon.classList.toggle("clicked");

    const newText = icon.getAttribute("data-text");
    informationIconTxt.textContent = newText;

    if (!isClicked) {
      // Expand ALL tile-line-information elements
      tileLineInformation.forEach(line => {
        line.style.width = "120%";
      });

      informationTopLine.style.opacity = "1";
      informationTopLine.style.transform = "translateY(-88px)";
      informationIconTxt.classList.add("information-icon-text-open");
    } else {
      // Collapse ALL tile-line-information elements
      tileLineInformation.forEach(line => {
        line.style.width = "100%";
      });

      informationTopLine.style.transform = "translateY(0)";
      informationTopLine.style.opacity = "0";
      informationIconTxt.classList.remove("information-icon-text-open");
    }
  });
});