import {
  library,
  icon,
} from "/NODE_MODULES/@fortawesome/fontawesome-svg-core/index.es.js";
import { faAtom } from "/NODE_MODULES/@fortawesome/free-solid-svg-icons/index.es.js";
import React, { useReducer } from "./react.js";

library.add(faAtom);

const spinner = icon(faAtom, { classes: ["fa-spin", "fa-5x"] });

function reducer(state = {}, action = {}) {
  const clonedState = { ...state };
  let { rover, inProgress, selectorChange, data, exception } = clonedState;
  switch (action.type) {
    case "ROVER_SELECTION":
      if (rover !== action.rover) {
        selectorChange = true;
        rover = action.rover;
        data = false;
      } else {
        selectorChange = false;
      }
      break;
    case "FETCH_IN_PROGRESS":
      inProgress = true;
      exception = false;
      data = false;
      selectorChange = false;
      break;
    case "FETCH_COMPLETE":
      inProgress = false;
      exception = false;
      data = action.data;
      selectorChange = false;
      break;
    default:
      break;
  }
  return { rover, inProgress, data, exception, selectorChange };
}

function Render(props) {
  const { photos, manifest } = props;
  const keys = Object.keys(manifest);
  return ` <ul class='manifest'>
            ${keys
              .map((key) => {
                return `<li class='manifest-header'>${key}</li>
                      <li class='manifest-item'>${manifest[key]}</li>
                      `;
              })
              .join("")}
           </ul>
           <div class='album'>
            ${photos
              .map(
                (photo) =>
                  `<div class="photo" style="background-image:url('${photo.img_src}');"></div>`
              )
              .join("")}
          </div>`;
}

function App() {
  const [state, dispatch] = useReducer(reducer, {
    rover: false,
    inProgress: false,
    selectorChange: false,
    data: false,
    exception: false,
  });
  const { rover, selectorChange, inProgress, data } = state;
  const handler = function (e) {
    dispatch({ type: "ROVER_SELECTION", rover: e.target.id });
  };
  document.querySelector(".gallery").onclick = handler;
  if (rover && selectorChange) {
    dispatch({ type: "FETCH_IN_PROGRESS" });
    fetch(`/rover-gallery?name=${rover}`)
      .then((r) => r.json())
      .then((data) => dispatch({ type: "FETCH_COMPLETE", data }))
      .catch((e) => console.warn(e));
  }
  return `
           ${inProgress ? spinner.html : data ? Render(data) : ""}
         `;
}
React.render("root", App);
