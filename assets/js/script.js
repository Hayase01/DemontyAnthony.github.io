
"use strict";

document.documentElement.classList.add("js-ready");

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".navigation");
const navLinks = document.querySelectorAll(".nav-link");
const revealElements = document.querySelectorAll(".reveal");
const yearElement = document.querySelector("#year");


if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


function closeMenu() {
    if (!menuToggle || !navigation) return;

    navigation.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Ouvrir le menu");
}

if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

        menuToggle.setAttribute("aria-expanded", String(!isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Ouvrir le menu" : "Fermer le menu"
        );

        navigation.classList.toggle("open", !isOpen);
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    // On referme le menu si on repasse sur grand écran.
    window.addEventListener("resize", () => {
        if (window.innerWidth > 680) {
            closeMenu();
        }
    });
}

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");

                    // Une fois visible, l'élément n'a plus besoin
                    // d'être observé.
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach((element) => {
        element.classList.add("visible");
    });
}

const sections = document.querySelectorAll(
    "main section[id]"
);

if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const currentId = entry.target.id;

                navLinks.forEach((link) => {
                    const isActive =
                        link.getAttribute("href") === `#${currentId}`;

                    link.classList.toggle("active", isActive);
                });
            });
        },
        {
            rootMargin: "-35% 0px -55% 0px"
        }
    );

    sections.forEach((section) => {
        sectionObserver.observe(section);
    });
}

const heroVisual = document.querySelector(".hero-visual");

const canUsePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
).matches;

if (heroVisual && canUsePointer && !prefersReducedMotion) {
    heroVisual.addEventListener("pointermove", (event) => {
        const bounds = heroVisual.getBoundingClientRect();

        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;

        const rotateY = (x - 0.5) * 5;
        const rotateX = (0.5 - y) * 5;

        heroVisual.style.transform =
            `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    heroVisual.addEventListener("pointerleave", () => {
        heroVisual.style.transform = "";
    });
}
