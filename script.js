 document.addEventListener('DOMContentLoaded', () => {
            
            // Menu Mobile
            const hamburger = document.querySelector('.hamburger');
            const navMenuMobile = document.querySelector('.nav-menu-mobile');
            const navLinks = document.querySelectorAll('.nav-link');

            if (hamburger) {
                hamburger.addEventListener('click', () => {
                    navMenuMobile.classList.toggle('active');
                });
            }

            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenuMobile.classList.remove('active');
                });
            });

            // Scroll Reveal
            const reveals = document.querySelectorAll('.reveal');
            const revealOnScroll = () => {
                const windowHeight = window.innerHeight;
                const elementVisible = 100;
                reveals.forEach((reveal) => {
                    const elementTop = reveal.getBoundingClientRect().top;
                    if (elementTop < windowHeight - elementVisible) {
                        reveal.classList.add('active');
                    }
                });
            };
            window.addEventListener('scroll', revealOnScroll);
            revealOnScroll(); 
            
            // Galeria
            const galleryItems = document.querySelectorAll('.gallery-item img');
            const lightbox = document.getElementById('lightbox');
            const lightboxImg = document.getElementById('lightbox-img');
            const lightboxClose = document.querySelector('.lightbox-close');

            if (lightbox && lightboxImg && lightboxClose && galleryItems.length > 0) {
                galleryItems.forEach(item => {
                    item.addEventListener('click', () => {
                        lightbox.style.display = 'flex';
                        lightboxImg.src = item.src;
                    });
                });
                const closeLightbox = () => { lightbox.style.display = 'none'; };
                lightboxClose.addEventListener('click', closeLightbox);
                lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
            }

            // VLibras Loader Safe
            // O código abaixo carrega o widget VLibras apenas quando a janela inteira estiver carregada
            // e adiciona um tratamento de erro para evitar que falhas de rede interrompam o site.
            window.addEventListener('load', () => {
                try {
                    const script = document.createElement('script');
                    script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
                    script.async = true;
                    script.onload = () => {
                        if (window.VLibras) {
                            new window.VLibras.Widget('https://vlibras.gov.br/app');
                        }
                    };
                    // Previne que erros de script apareçam no console se o recurso for bloqueado
                    script.onerror = () => {
                        console.log("VLibras não pôde ser carregado. Continuando sem o widget.");
                    };
                    document.body.appendChild(script);
                } catch (e) {
                    console.log("Erro ao iniciar VLibras:", e);
                }
            });
        });