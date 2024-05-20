import $ from "./FossaQuery.ts";

// $(".hoi")
//   .find('input[type="checkbox"]')
//   .setAttribute("checked", "true")
//   .setAttribute("disabled", "true")
//   .classList.add("hoi")
//   .addClass("pietje");

let wow = $(".hoi")
  .iterate((e: HTMLElement) => (e.innerHTML += "asd"))
  .iterate((e: HTMLElement) => (e.style.color = "red"))
  .transformFunction("querySelectorAll", "input")
  .iterate((e) => (e.style.accentColor = "red"));
console.log(wow);
