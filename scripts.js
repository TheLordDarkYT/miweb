// Efecto pequeño cuando se hace scroll
window.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    if (window.scrollY > 40) {
        header.style.background = "#000";
    } else {
        header.style.background = "#111";
    }
});
