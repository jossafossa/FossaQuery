import $ from "./FossaQuery.ts";

let inputs = $("input");
// if (inputs.length > 0) {
let form = inputs.transform("closest", "form");
form.forEachFunction((form) => {
  form.style.border = "1px solid red";
});

// inputs.forEach("addEventListener", "change");
console.log(form);
// }

form.on("submit", (e) => {
  e.preventDefault();
  console.log("submitted");
});

let button = $("button");
button.on("click", () => {
  button.toggleClass("test");
});
