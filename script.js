// Scripts para interatividade futura, se necessário.

document.addEventListener("DOMContentLoaded", function() {
    console.log("Site Gnow Tours carregado e pronto!");

    // Inicialização do Swiper para o carrossel de passeios na home
    if (document.querySelector(".passeios-swiper")) {
        const swiper = new Swiper(".passeios-swiper", {
            slidesPerView: 1,
            spaceBetween: 20,
            slidesPerGroup: 1, // Garante que mova um slide por vez
            loop: true,
            grabCursor: true,
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            breakpoints: {
                // when window width is >= 768px (tablets)
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                    slidesPerGroup: 1 // Mantém um por vez em tablets também, se desejado, ou pode ser 2
                },
                // when window width is >= 1024px (desktop)
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                    slidesPerGroup: 1 // Garante que mova um slide por vez no desktop
                }
            }
        });
    }

    // Exemplo: Suavizar scroll para âncoras
    document.querySelectorAll("a[href^=\"#\"]").forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            if (targetId.length > 1 && document.querySelector(targetId)) {
                document.querySelector(targetId).scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    });

    // Verificar se há placeholders de WhatsApp e email e alertar no console
    const whatsappLinks = document.querySelectorAll("a[href*=\"SEUNUMERODOWHATSAPP\"]");
    if (whatsappLinks.length > 0) {
        console.warn("ATENÇÃO: Links de WhatsApp contêm placeholder \"SEUNUMERODOWHATSAPP\". Substitua pelo número correto.");
    }

    const emailLinks = document.querySelectorAll("a[href*=\"contato@gnowtours.com\"]");
    emailLinks.forEach(link => {
        if (link.textContent === "contato@gnowtours.com") {
            console.info("INFO: Link de e-mail \"contato@gnowtours.com\" detectado. Verifique se este é o endereço final ou um placeholder.");
        }
    });

    // Lógica para o menu hambúrguer
    const menuHamburger = document.querySelector(".menu-hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (menuHamburger && navLinks) {
        menuHamburger.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            menuHamburger.classList.toggle("active");
            const isExpanded = navLinks.classList.contains("active");
            menuHamburger.setAttribute("aria-expanded", isExpanded);
        });
    }
});

