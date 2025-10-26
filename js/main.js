// Lógica para animaciones de scroll: header shrink y reveal sections
(function(){
    const header = document.getElementById('site-header');
    const shrinkOn = 60;

    function onScroll(){
        if(window.scrollY > shrinkOn){
            header.classList.add('shrink');
        } else {
            header.classList.remove('shrink');
        }
    }

    // Reveal elements when in viewport
    const observer = new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
            if(entry.isIntersecting){
                entry.target.classList.add('visible');
                // optional: unobserve to prevent future callbacks
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.addEventListener('DOMContentLoaded', ()=>{
        // Attach scroll handler
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        // Observe reveal elements
        document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
        
        // Responsive menu: hamburger toggle
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');

        if(hamburger && navMenu){
            hamburger.addEventListener('click', (e)=>{
                const isOpen = navMenu.classList.toggle('open');
                hamburger.classList.toggle('active', isOpen);
                hamburger.setAttribute('aria-expanded', String(isOpen));
            });

            // Keyboard support: toggle with Enter or Space
            hamburger.addEventListener('keydown', (e)=>{
                if(e.key === 'Enter' || e.key === ' ' || e.code === 'Space'){ 
                    e.preventDefault();
                    const isOpen = navMenu.classList.toggle('open');
                    hamburger.classList.toggle('active', isOpen);
                    hamburger.setAttribute('aria-expanded', String(isOpen));
                }
            });

            // Close menu when clicking a link (mobile)
            // BUT ignore links that toggle submenus (have class 'drop-toggle')
            navMenu.querySelectorAll('a').forEach(a=>{
                a.addEventListener('click', (e)=>{
                    // if this anchor is a drop-toggle (opens sub-menu), don't close the whole nav
                    if(a.classList.contains('drop-toggle')){
                        return;
                    }

                    // otherwise, when on mobile/tablet, close the main nav after clicking
                    if(window.innerWidth <= 900){
                        navMenu.classList.remove('open');
                        hamburger.classList.remove('active');
                        hamburger.setAttribute('aria-expanded','false');
                    }
                });
            });

            // Close menu on resize to desktop
            window.addEventListener('resize', ()=>{
                if(window.innerWidth > 900){
                    navMenu.classList.remove('open');
                    hamburger.classList.remove('active');
                    hamburger.setAttribute('aria-expanded','false');
                }
            });
        }

        // Close menu with Escape key
        document.addEventListener('keydown', (e)=>{
            if(e.key === 'Escape' || e.key === 'Esc'){
                if(navMenu && navMenu.classList.contains('open')){
                    navMenu.classList.remove('open');
                    if(hamburger){
                        hamburger.classList.remove('active');
                        hamburger.setAttribute('aria-expanded','false');
                        hamburger.focus();
                    }
                }
                // also close any open dropdowns on mobile
                document.querySelectorAll('.dropdown.open').forEach(d=>d.classList.remove('open'));
            }
        });

        // Dropdown toggle for touch/mobile devices
        document.querySelectorAll('.drop-toggle').forEach(toggle=>{
            toggle.addEventListener('click', (e)=>{
                const parent = toggle.closest('.dropdown');
                if(window.innerWidth <= 900){
                    e.preventDefault();
                    parent.classList.toggle('open');
                }
            });
        });

        // Open modals for Estudiante/Profesor
        document.querySelectorAll('.open-modal').forEach(link=>{
            link.addEventListener('click', (e)=>{
                e.preventDefault();
                const targetId = link.getAttribute('data-target');
                const modal = document.getElementById(targetId);
                if(modal){
                    openModal(modal);
                }
            });
        });

        // Modal utility functions
        function openModal(modal){
            modal.classList.add('open');
            modal.setAttribute('aria-hidden','false');
            document.body.style.overflow = 'hidden';
            // focus first input
            const firstInput = modal.querySelector('input');
            if(firstInput) firstInput.focus();
        }
        function closeModal(modal){
            modal.classList.remove('open');
            modal.setAttribute('aria-hidden','true');
            document.body.style.overflow = '';
        }

        // Close modal handlers (close button, overlay, cancel)
        document.querySelectorAll('.modal').forEach(modal=>{
            modal.addEventListener('click', (e)=>{
                // close when clicking overlay or elements with data-close
                if(e.target.getAttribute && e.target.getAttribute('data-close') != null) {
                    closeModal(modal);
                }
            });
            modal.querySelectorAll('[data-close]').forEach(btn=>{
                btn.addEventListener('click', ()=>closeModal(modal));
            });
            // prevent clicks inside content from closing
            const content = modal.querySelector('.modal-content');
            if(content) content.addEventListener('click', (ev)=> ev.stopPropagation());
        });

        // Handle form submissions (demo: show alert and close modal)
        const formEst = document.getElementById('form-estudiante');
        if(formEst){
            formEst.addEventListener('submit', (e)=>{
                e.preventDefault();
                // here you would send data to server; we'll show a simple message
                alert('Datos de estudiante recibidos.');
                closeModal(document.getElementById('modal-estudiante'));
                formEst.reset();
            });
        }
        const formProf = document.getElementById('form-profesor');
        if(formProf){
            formProf.addEventListener('submit', (e)=>{
                e.preventDefault();
                alert('Datos de profesor recibidos.');
                closeModal(document.getElementById('modal-profesor'));
                formProf.reset();
            });
        }

        // Contact page form handler
        const contactForm = document.getElementById('contact-form');
        if(contactForm){
            contactForm.addEventListener('submit', (e)=>{
                e.preventDefault();
                // Simple demo behaviour: show a message and reset form
                alert('Gracias. Tu mensaje ha sido enviado.');
                contactForm.reset();
            });
        }

        // Close nav if clicking outside (mobile open state)
        document.addEventListener('click', (e)=>{
            if(navMenu && navMenu.classList.contains('open')){
                const inside = e.composedPath && e.composedPath().includes(navMenu);
                const clickedHamburger = e.target === hamburger || hamburger.contains(e.target);
                if(!inside && !clickedHamburger){
                    navMenu.classList.remove('open');
                    hamburger.classList.remove('active');
                    hamburger.setAttribute('aria-expanded','false');
                }
            }
        });
    });
})();
