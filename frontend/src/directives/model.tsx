function model(el: Element, value) {
  console.log(el, value);
  // const [field, setField] = value();

  // const setField = () => {
  //   el.value = field();
  // };
 
  // createRenderEffect(() => (el.value = field()));
 
  // el.addEventListener("input", (e) => setField(e.target.value));

  // onCleanup(() => el.removeEventListener("input"))
}

export default model;
