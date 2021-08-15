import immutable from "/NODE_MODULES/immutable/dist/immutable.es.js";

const React = (function React() {
  const store = new Map();
  const domStore = new WeakMap();
  let DOM_ROOT;
  function render(root, app) {
    const element = document.getElementById(root);
    if (element) {
      DOM_ROOT = element;
      DOM_ROOT.innerHTML = app() || "";
      domStore.set(DOM_ROOT, { app });
    }
  }
  function update() {
    DOM_ROOT.innerHTML = "";
    DOM_ROOT.innerHTML = domStore.get(DOM_ROOT).app() || "";
  }
  return {
    render,
    update,
    get store() {
      return store;
    },
  };
})();

export function useReducer(reducer = function () {}, initialState = {}) {
  let mutableState = JSON.parse(JSON.stringify(initialState));
  let state, dispatch;
  if (React.store.has(reducer)) {
    dispatch = React.store.get(reducer).dispatch;
    state = React.store.get(reducer).state;
  } else {
    state = immutable.fromJS(mutableState);
    dispatch = async function (action) {
      const interimState = reducer(
        (React.store.has(reducer)
          ? React.store.get(reducer).state
          : state
        ).toJS(),
        action
      );
      Promise.resolve(
        Object.assign(React.store.get(reducer), {
          state: immutable.fromJS(interimState),
        })
      ).then((resp) => {
        React.update();
        return resp;
      });
    };
    React.store.set(reducer, { dispatch, state });
  }
  return [state.toJS(), dispatch];
}
export default React;
