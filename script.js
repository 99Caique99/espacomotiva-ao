        document.addEventListener('DOMContentLoaded', () => {
            const opcoesObservador = { root: null, rootMargin: '0px 0px -20px 0px', threshold: 0 };
            
            const observador = new IntersectionObserver((entradas, obs) => {
                entradas.forEach(entrada => {
                    if (entrada.isIntersecting) {
                        entrada.target.classList.add('revelado');
                        obs.unobserve(entrada.target);
                    }
                });
            }, opcoesObservador);

            document.querySelectorAll('.revelar-cima, .revelar-esquerda, .revelar-direita, .revelar-escala, .gatilho-texto').forEach(el => {
                observador.observe(el);
            });
            
            setTimeout(() => {
                const tituloPrincipal = document.querySelector('.gatilho-texto');
                if(tituloPrincipal) tituloPrincipal.classList.add('revelado');
            }, 100);

            const pontoCursor = document.getElementById('ponto-cursor');
            const anelCursor = document.getElementById('anel-cursor');
            const alvosHover = document.querySelectorAll('a, button, .alvo-hover, input');
            
            let mouseX = window.innerWidth / 2;
            let mouseY = window.innerHeight / 2;
            let anelX = mouseX;
            let anelY = mouseY;
            
            const ehToque = window.matchMedia("(pointer: coarse)").matches;

            if(window.innerWidth > 991 && !ehToque) {
                window.addEventListener('mousemove', (e) => {
                    mouseX = e.clientX; mouseY = e.clientY;
                    pontoCursor.style.left = `${mouseX}px`;
                    pontoCursor.style.top = `${mouseY}px`;
                });

                const renderizarCursor = () => {
                    anelX += (mouseX - anelX) * 0.15; 
                    anelY += (mouseY - anelY) * 0.15;
                    anelCursor.style.left = `${anelX}px`;
                    anelCursor.style.top = `${anelY}px`;
                    requestAnimationFrame(renderizarCursor);
                };
                renderizarCursor();

                alvosHover.forEach(alvo => {
                    alvo.addEventListener('mouseenter', () => document.body.classList.add('cursor-focado'));
                    alvo.addEventListener('mouseleave', () => document.body.classList.remove('cursor-focado'));
                });
            } else {
                if(pontoCursor) pontoCursor.remove();
                if(anelCursor) anelCursor.remove();
            }

            const botoesMagneticos = document.querySelectorAll('.btn-magnetico');
            if(window.innerWidth > 991 && !ehToque) {
                botoesMagneticos.forEach(botao => {
                    botao.addEventListener('mousemove', (e) => {
                        const posicao = botao.getBoundingClientRect();
                        const x = e.pageX - posicao.left - posicao.width / 2;
                        const y = e.pageY - posicao.top - posicao.height / 2;
                        botao.style.transform = `translate(${x * 0.3}px, ${y * 0.4}px)`;
                    });
                    botao.addEventListener('mouseleave', () => botao.style.transform = 'translate(0px, 0px)');
                });
            }

            const containerParallax = document.getElementById('inicio');
            const elementosParallax = document.querySelectorAll('.elemento-parallax');

            if(window.innerWidth > 991 && !ehToque && containerParallax) {
                containerParallax.addEventListener('mousemove', (e) => {
                    const x = (e.clientX - window.innerWidth / 2);
                    const y = (e.clientY - window.innerHeight / 2);
                    elementosParallax.forEach(elemento => {
                        const velocidade = elemento.getAttribute('data-speed');
                        elemento.style.transform = `translate(${x * velocidade}px, ${y * velocidade}px)`;
                    });
                });
                containerParallax.addEventListener('mouseleave', () => {
                    elementosParallax.forEach(elemento => elemento.style.transform = `translate(0px, 0px)`);
                });
            }

            const cartoesInclinados = document.querySelectorAll('.cartao-inclinado');
            if(window.innerWidth > 991 && !ehToque) {
                cartoesInclinados.forEach(cartao => {
                    cartao.addEventListener('mousemove', e => {
                        const retangulo = cartao.getBoundingClientRect();
                        const x = e.clientX - retangulo.left; const y = e.clientY - retangulo.top;
                        const pctX = (x / retangulo.width - 0.5) * 2; const pctY = (y / retangulo.height - 0.5) * 2;
                        cartao.style.transform = `perspective(1000px) rotateY(${pctX * 4}deg) rotateX(${-pctY * 4}deg) scale3d(1.02, 1.02, 1.02)`;
                    });
                    cartao.addEventListener('mouseleave', () => cartao.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)`);
                });
            }

            const cabecalho = document.getElementById('cabecalho');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) cabecalho.classList.add('rolado'); 
                else cabecalho.classList.remove('rolado');
            });

            const iconeMenu = document.getElementById('icone-menu');
            const menuMobile = document.getElementById('menu-mobile');
            const fecharMenu = document.getElementById('fechar-menu');
            const linksMobile = document.querySelectorAll('.link-mobile');
            const alternarMenu = () => menuMobile.classList.toggle('ativo');
            
            iconeMenu.addEventListener('click', alternarMenu);
            fecharMenu.addEventListener('click', alternarMenu);
            linksMobile.forEach(link => link.addEventListener('click', alternarMenu));

            const itensGaleria = document.querySelectorAll('.item-galeria');
            const modalImagem = document.getElementById('modal-imagem');
            const imgModal = document.getElementById('img-modal');
            const btnFecharModal = document.querySelector('.fechar-modal');

            itensGaleria.forEach(item => {
                item.addEventListener('click', () => {
                    imgModal.src = item.querySelector('img').src;
                    modalImagem.style.display = 'flex';
                    setTimeout(() => modalImagem.classList.add('mostrar'), 10);
                });
            });

            const ocultarModal = () => {
                modalImagem.classList.remove('mostrar');
                setTimeout(() => modalImagem.style.display = 'none', 300);
            };

            btnFecharModal.addEventListener('click', ocultarModal);
            modalImagem.addEventListener('click', (e) => { if(e.target === modalImagem) ocultarModal(); });

            const fundoCanvas = document.getElementById('fundo-canvas');
            if(fundoCanvas) {
                const contexto = fundoCanvas.getContext('2d');
                let arrayParticulas = [];
                
                const redimensionar = () => { fundoCanvas.width = window.innerWidth; fundoCanvas.height = window.innerHeight; };
                window.addEventListener('resize', redimensionar);
                redimensionar();

                let estadoMouse = { x: null, y: null, raio: 100 };
                if(!ehToque) {
                    window.addEventListener('mousemove', (e) => { estadoMouse.x = e.x; estadoMouse.y = e.y; });
                    window.addEventListener('mouseout', () => { estadoMouse.x = undefined; estadoMouse.y = undefined; });
                }

                class Particula {
                    constructor() {
                        this.x = Math.random() * fundoCanvas.width; this.y = Math.random() * fundoCanvas.height;
                        this.tamanho = Math.random() * 2 + 0.5; this.baseX = this.x; this.baseY = this.y;
                        this.densidade = (Math.random() * 20) + 1;
                        this.cor = Math.random() > 0.5 ? 'rgba(197, 160, 89, 0.25)' : 'rgba(11, 20, 38, 0.1)';
                    }
                    atualizar() {
                        if (estadoMouse.x != null) {
                            let distX = estadoMouse.x - this.x; let distY = estadoMouse.y - this.y;
                            let distancia = Math.sqrt(distX * distX + distY * distY);
                            if (distancia < estadoMouse.raio) {
                                const forca = (estadoMouse.raio - distancia) / estadoMouse.raio;
                                this.x -= (distX / distancia) * forca * this.densidade * 0.6;
                                this.y -= (distY / distancia) * forca * this.densidade * 0.6;
                            } else {
                                if (this.x !== this.baseX) this.x -= (this.x - this.baseX) * 0.05;
                                if (this.y !== this.baseY) this.y -= (this.y - this.baseY) * 0.05;
                                this.baseX += (Math.random() - 0.5) * 0.3; this.baseY += (Math.random() - 0.5) * 0.3;
                            }
                        } else {
                            this.baseX += (Math.random() - 0.5) * 0.2; this.baseY += (Math.random() - 0.5) * 0.2;
                            this.x = this.baseX; this.y = this.baseY;
                        }
                    }
                    desenhar() {
                        contexto.fillStyle = this.cor; contexto.beginPath();
                        contexto.arc(this.x, this.y, this.tamanho, 0, Math.PI * 2); contexto.fill();
                    }
                }

                const iniciarParticulas = () => {
                    arrayParticulas = [];
                    const quantidade = window.innerWidth < 768 ? 30 : 100;
                    for (let i = 0; i < quantidade; i++) arrayParticulas.push(new Particula());
                }
                iniciarParticulas();

                const animarParticulas = () => {
                    contexto.clearRect(0, 0, fundoCanvas.width, fundoCanvas.height);
                    arrayParticulas.forEach(p => { p.atualizar(); p.desenhar(); });
                    requestAnimationFrame(animarParticulas);
                }
                animarParticulas();
            }
        });
const botoesMagneticos = document.querySelectorAll('.btn-magnetico');
            if(window.innerWidth > 991 && !ehToque) {
                botoesMagneticos.forEach(botao => {
                    botao.addEventListener('mousemove', (e) => {
                        const posicao = botao.getBoundingClientRect();
                        // CORREÇÃO: Usar clientX e clientY para não bugar com o scroll da página
                        const x = e.clientX - posicao.left - posicao.width / 2;
                        const y = e.clientY - posicao.top - posicao.height / 2;
                        botao.style.transform = `translate(${x * 0.3}px, ${y * 0.4}px)`;
                    });
                    botao.addEventListener('mouseleave', () => {
                        botao.style.transform = 'translate(0px, 0px)';
                    });
                });
            }