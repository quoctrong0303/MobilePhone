const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);



isToggle = false;
function toggleList() {
    var lists =  $$('.toggle-list');
    lists.forEach(element => {
        element.onclick = () => {
            isToggle = !isToggle;
            if (isToggle) {
                element.classList.add('show');
                element.classList.remove('hide');

            } else {
                element.classList.remove('show');
                element.classList.add('hide');
            }

        }
    });
}
toggleList();