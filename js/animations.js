document.addEventListener('DOMContentLoaded', () => {
    // 1. Cursor Glow Effect
    const cursor = document.createElement('div');
    cursor.classList.add('cursor-glow');
    document.body.appendChild(cursor);
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // 2. Scroll Reveal
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;
        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger on load

    // 3. Number Count Up (for stats)
    const counters = document.querySelectorAll('.count-up');
    const speed = 200;
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;
            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 15);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });

    // 4. Toast Message Helper (Global)
    window.showToast = (message, type = 'success') => {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.classList.add('toast-container');
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.classList.add('toast', `toast-${type}`);
        
        let icon = type === 'success' ? 'uil-check-circle' : 'uil-exclamation-circle';
        toast.innerHTML = `<i class="uil ${icon}"></i> <span>${message}</span>`;
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 5000);
    };

    // 5. Password Visibility Toggle
    const passToggles = document.querySelectorAll('.toggle-password');
    passToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                this.classList.remove('uil-eye');
                this.classList.add('uil-eye-slash');
            } else {
                input.type = 'password';
                this.classList.remove('uil-eye-slash');
                this.classList.add('uil-eye');
            }
        });
    });

    // 6. Shake Animation (Simulation on forms)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            // Remove shake class to re-trigger if needed
            form.classList.remove('shake');
            // Check if standard login form for demo
            if(form.id === 'loginForm' || form.id === 'signupForm') {
                e.preventDefault();
                // Simulate success or error randomly for demo, or just show success
                setTimeout(() => {
                    window.showToast("Success! Redirecting...", "success");
                }, 500);
            }
        });
    });

    // 7. Skeleton to Content Transition (Dashboard Tabs)
    const tabTriggers = document.querySelectorAll('.dash-tab, .dash-link');
    tabTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const targetId = trigger.getAttribute('href').substring(1);
            const targetPanel = document.getElementById(targetId);
            if(targetPanel) {
                targetPanel.classList.add('skeleton-loading');
                setTimeout(() => {
                    targetPanel.classList.remove('skeleton-loading');
                }, 800); // 800ms skeleton
            }
        });
    });
});
