document.addEventListener('DOMContentLoaded', () => {
    // 1. Custom Cursor Glow
    if (window.innerWidth > 768) {
        const cursorDot = document.createElement('div');
        cursorDot.classList.add('cursor-dot');
        const cursorOutline = document.createElement('div');
        cursorOutline.classList.add('cursor-outline');
        
        document.body.appendChild(cursorDot);
        document.body.appendChild(cursorOutline);

        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // slight delay for the outline for a smooth effect
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 150, fill: "forwards" });
        });

        // Add hover effect to interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .btn, input, select, .card, .tilt-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovering'));
        });
    }

    // 2. Premium Loading Screen
    const pLoader = document.getElementById('premium-loader');
    if (pLoader) {
        document.body.classList.add('preloading');
        const textEl = document.getElementById('loader-text');
        const progressBar = document.getElementById('loader-progress');
        const lCanvas = document.getElementById('loader-canvas');
        
        // Canvas Particles
        if (lCanvas) {
            const lCtx = lCanvas.getContext('2d');
            let lParticles = [];
            const resizeLCanvas = () => { lCanvas.width = window.innerWidth; lCanvas.height = window.innerHeight; };
            window.addEventListener('resize', resizeLCanvas);
            resizeLCanvas();
            for(let i=0; i<40; i++) {
                lParticles.push({
                    x: Math.random() * lCanvas.width, y: Math.random() * lCanvas.height,
                    s: Math.random() * 2 + 1, vx: (Math.random()-0.5)*1, vy: (Math.random()-0.5)*1,
                    op: Math.random()*0.5 + 0.1
                });
            }
            const drawL = () => {
                lCtx.clearRect(0,0,lCanvas.width,lCanvas.height);
                lParticles.forEach(p => {
                    lCtx.fillStyle = `rgba(147, 197, 253, ${p.op})`;
                    lCtx.beginPath(); lCtx.arc(p.x, p.y, p.s, 0, Math.PI*2); lCtx.fill();
                    p.x += p.vx; p.y += p.vy;
                    if(p.x<0||p.x>lCanvas.width) p.vx*=-1; if(p.y<0||p.y>lCanvas.height) p.vy*=-1;
                });
                if(!pLoader.classList.contains('hide')) requestAnimationFrame(drawL);
            };
            drawL();
        }

        // Text Typing
        const phrases = ["Loading Creativity...", "Preparing Digital Collections...", "Connecting Artists & Collectors...", "Almost Ready..."];
        let phraseIndex = 0;
        let charIndex = 0;
        const typeDelay = 40;
        const nextPhraseDelay = 500;
        let isTyping = true;
        
        const typeText = () => {
            if(!isTyping) return;
            const current = phrases[phraseIndex];
            if (!current) return;
            textEl.textContent = current.substring(0, charIndex+1);
            charIndex++;
            if(charIndex < current.length) {
                setTimeout(typeText, typeDelay);
            } else {
                phraseIndex++;
                if(phraseIndex < phrases.length) {
                    charIndex = 0;
                    setTimeout(typeText, nextPhraseDelay);
                }
            }
        };
        setTimeout(typeText, 300);

        // Progress Bar
        let prog = 0;
        const progInterval = setInterval(() => {
            prog += Math.random() * 5 + 1;
            if(prog >= 100) {
                prog = 100;
                clearInterval(progInterval);
            }
            if (progressBar) progressBar.style.width = prog + '%';
        }, 80);

        // Transition out after ~3.2s
        setTimeout(() => {
            isTyping = false;
            clearInterval(progInterval);
            if (progressBar) progressBar.style.width = '100%';
            pLoader.classList.add('zoom-out');
            
            setTimeout(() => {
                pLoader.classList.add('hide');
                document.body.classList.remove('preloading');
                document.body.classList.add('site-revealed');
                setTimeout(() => pLoader.remove(), 800);
            }, 800);
        }, 3200);
    }

    // 3. Sticky Glass Header
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // 4. Staggered Scroll Reveal
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
    
    revealElements.forEach(el => revealObserver.observe(el));

    // 5. 3D Hover Tilt Effect
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const tiltX = ((y - centerY) / centerY) * -10; // max rotation 10deg
            const tiltY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = 'none';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });

    // 6. Magnetic Buttons
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
            
            btn.style.transform = `translate(${x}px, ${y}px)`;
            btn.style.transition = 'none';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
            btn.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });

    // 7. Ripple Effect for Buttons
    const buttons = document.querySelectorAll('.btn:not(.btn-outline)');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            let ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);

            let rect = this.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;

            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            setTimeout(() => { ripple.remove(); }, 600);
        });
    });

    // 8. Dashboard Sidebar Logic
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
    if (sidebarLinks.length > 0) {
        sidebarLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId.startsWith('#')) {
                    e.preventDefault();
                    
                    // Update Active Link
                    sidebarLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Update Active Tab Content
                    const allTabs = document.querySelectorAll('.tab-content');
                    allTabs.forEach(tab => tab.classList.remove('active-tab'));
                    
                    const targetTab = document.querySelector(targetId);
                    if (targetTab) {
                        targetTab.classList.add('active-tab');
                    }
                }
            });
        });
    }

    // 9. Login/Signup Routing Logic
    const authForm = document.getElementById('authForm');
    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const roleSelect = document.getElementById('roleSelect');
            if (roleSelect) {
                const role = roleSelect.value;
                if (role === 'user') {
                    window.location.href = 'dashboard-user.html';
                } else if (role === 'artist') {
                    window.location.href = 'dashboard-artist.html';
                } else if (role === 'admin') {
                    window.location.href = 'dashboard-admin.html';
                }
            }
        });
    }

    // 10. Glow Cards Mouse Tracking
    const glowCards = document.querySelectorAll('.card, .tilt-card, .glass-panel, .contact-info-card, .contact-form, .stat-card');
    glowCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
        card.classList.add('glow-card');
    });

    // 11. Smooth Page Transitions
    const links = document.querySelectorAll('a[href]:not([href^="#"])');
    links.forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            // Only apply to relative/internal links that don't open in new tab
            if (href && !href.startsWith('http') && !link.hasAttribute('target')) {
                e.preventDefault();
                document.body.classList.add('page-transitioning');
                setTimeout(() => {
                    window.location.href = href;
                }, 500);
            }
        });
    });

    // 12. Number Counter Animation
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseFloat(counter.getAttribute('data-target'));
                    const duration = 2000;
                    const startTime = performance.now();
                    
                    function updateCounter(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const easeProgress = 1 - Math.pow(1 - progress, 4);
                        const currentVal = target * easeProgress;
                        
                        if (target % 1 === 0) {
                            counter.innerText = Math.floor(currentVal);
                        } else {
                            counter.innerText = currentVal.toFixed(1);
                        }
                        
                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target;
                        }
                    }
                    requestAnimationFrame(updateCounter);
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.1 });
        
        counters.forEach(c => counterObserver.observe(c));
    }

    // 13. Auto-changing Hero Artwork
    const heroImg = document.getElementById('hero-artwork-img');
    const heroTitle = document.getElementById('hero-artwork-title');
    const heroAuthor = document.getElementById('hero-artwork-author');
    const heroPrice = document.getElementById('hero-artwork-price');
    
    if (heroImg && heroTitle && heroAuthor && heroPrice) {
        heroImg.style.transition = 'opacity 0.3s ease';
        const artworks = [
            { img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop", title: "Cyberpunk Odyssey", author: "by @neon_dreamer", price: "2.5 ETH" },
            { img: "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?q=80&w=1000&auto=format&fit=crop", title: "Abstract Dimensions", author: "by @creative_mind", price: "1.2 ETH" },
            { img: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1000&auto=format&fit=crop", title: "Neon Genesis", author: "by @synthwave", price: "0.8 ETH" }
        ];
        let currentArt = 0;
        
        setInterval(() => {
            currentArt = (currentArt + 1) % artworks.length;
            const art = artworks[currentArt];
            
            heroImg.style.opacity = '0';
            setTimeout(() => {
                heroImg.src = art.img;
                heroTitle.innerText = art.title;
                heroAuthor.innerText = art.author;
                heroPrice.innerText = art.price;
                heroImg.style.opacity = '1';
            }, 300);
        }, 5000);
    }

    // 14. Floating Particles
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const resizeCanvas = () => {
            const heroSection = document.querySelector('.hero');
            if(heroSection) {
                canvas.width = heroSection.clientWidth;
                canvas.height = heroSection.clientHeight;
            } else {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        };
        resizeCanvas();
        
        const particles = [];
        for (let i = 0; i < 60; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 1.5,
                speedY: (Math.random() - 0.5) * 1.5,
                opacity: Math.random() * 0.5 + 0.1
            });
        }
        
        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                ctx.fillStyle = `rgba(147, 197, 253, ${p.opacity})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                
                p.x += p.speedX;
                p.y += p.speedY;
                
                if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
                if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
            });
            requestAnimationFrame(drawParticles);
        }
        drawParticles();
        window.addEventListener('resize', resizeCanvas);
    }

    // 15. Marketplace: Quick View & Price Slider
    const quickViewModal = document.getElementById('quickViewModal');
    if (quickViewModal) {
        const closeQuickView = document.getElementById('closeQuickView');
        const qvImg = document.getElementById('qv-img');
        const qvTitle = document.getElementById('qv-title');
        const qvAuthor = document.getElementById('qv-author');
        const qvPrice = document.getElementById('qv-price');

        document.querySelectorAll('.quick-view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const cardInner = btn.closest('.tilt-card-inner');
                if(cardInner) {
                    const img = cardInner.querySelector('img').src;
                    const title = cardInner.querySelector('h4').innerText;
                    const author = cardInner.querySelector('p').innerText;
                    const price = cardInner.querySelector('.text-gradient').innerText;
                    
                    qvImg.src = img;
                    qvTitle.innerText = title;
                    qvAuthor.innerText = author;
                    qvPrice.innerText = price;
                    quickViewModal.classList.add('active');
                }
            });
        });

        closeQuickView.addEventListener('click', () => {
            quickViewModal.classList.remove('active');
        });
        
        quickViewModal.addEventListener('click', (e) => {
            if (e.target === quickViewModal) {
                quickViewModal.classList.remove('active');
            }
        });

        const priceSlider = document.getElementById('priceSlider');
        const minPrice = document.getElementById('minPrice');
        const maxPrice = document.getElementById('maxPrice');
        if (priceSlider && minPrice && maxPrice) {
            priceSlider.addEventListener('input', (e) => {
                maxPrice.value = e.target.value;
                minPrice.value = "0";
            });
            maxPrice.addEventListener('input', (e) => {
                priceSlider.value = e.target.value;
            });
        }
    }

});
