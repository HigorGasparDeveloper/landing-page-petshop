const input_menu_button = document.getElementById("menu-button")
const menu = document.getElementById("menu")
const all_bars_menu = document.getElementsByClassName('bar')

const class_elements = {
    0: 'animation-first-bar',
    1: 'animation-second-bar',
    2: 'animation-third-bar'
}

const openMenu = () => {
    menu.style.display = "flex"
}

const closeMenu = () => {
    menu.style.display = "none"
}

const clickMenuButton = () => {
    //open or close menu...
    Array.from(all_bars_menu).forEach((element, index) => {
        let class_element = class_elements[index]
        if (element.classList.contains(class_element)) {
            element.classList.remove(class_element)
            closeMenu()
            return
        }
        element.classList.add(class_element)
        openMenu()
    });
}

input_menu_button.addEventListener('click', clickMenuButton)