const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
var scrollButton = $(".arrow-scroll");
var body = document.body,
  html = document.documentElement;

var height = Math.max(
  body.scrollHeight,
  body.offsetHeight,
  html.clientHeight,
  html.scrollHeight,
  html.offsetHeight
);
isToggle = false;
function toggleList() {
  var lists = $$(".toggle-list");
  lists.forEach((element) => {
    element.onclick = () => {
      isToggle = !isToggle;
      if (isToggle) {
        element.classList.add("show");
        element.classList.remove("hide");
      } else {
        element.classList.remove("show");
        element.classList.add("hide");
      }
    };
  });
}
toggleList();

window.onscroll = () => {
  if (
    document.body.scrollTop > height / 4 ||
    document.documentElement.scrollTop > height / 4
  ) {
    scrollButton.style.display = "block";
  } else {
    scrollButton.style.display = "none";
  }
};

scrollButton.onclick = () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
};
