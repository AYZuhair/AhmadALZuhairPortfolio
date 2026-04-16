document.addEventListener('DOMContentLoaded', () => {
    const sections = ['home', 'stack', 'projects', 'contact'];
    let currentSectionIndex = 0;
    let isTransitioning = false;

    const overlay = document.getElementById('transition-overlay');
    const transitionTitle = document.getElementById('transition-title');
    const navItems = document.querySelectorAll('.nav-item');
    const allSections = document.querySelectorAll('.section');

    // Utility: Split text into characters (Robust version for symbols & entities)
    const splitTextIntoChars = () => {
        const targets = document.querySelectorAll('.main-title, .accent-text, .section-heading');
        targets.forEach(target => {
            // First, decode any existing content to get clean text
            const decoder = document.createElement('div');
            decoder.innerHTML = target.innerHTML;
            const nodes = Array.from(decoder.childNodes);
            
            target.innerHTML = '';
            target.style.opacity = '1';

            nodes.forEach((node, nodeIdx) => {
                if (node.nodeType === Node.TEXT_NODE || (node.nodeType === Node.ELEMENT_NODE && node.nodeName !== 'BR')) {
                    const text = node.textContent; // Literal characters
                    if (!text.trim()) return;

                    const lineContainer = document.createElement('span');
                    lineContainer.className = 'line-container';
                    lineContainer.style.display = 'block';

                    const words = text.split(' ');
                    words.forEach((word, wordIdx) => {
                        const wordSpan = document.createElement('span');
                        wordSpan.style.whiteSpace = 'nowrap';
                        wordSpan.style.display = 'inline-block';

                        [...word].forEach((char, charIdx) => {
                            const charContainer = document.createElement('span');
                            charContainer.className = 'char-container';
                            const charSpan = document.createElement('span');
                            charSpan.className = 'char';
                            charSpan.textContent = char;
                            const globalIdx = (nodeIdx * 20) + (wordIdx * 10) + charIdx;
                            charSpan.style.setProperty('--char-index', globalIdx);
                            charContainer.appendChild(charSpan);
                            wordSpan.appendChild(charContainer);
                        });

                        lineContainer.appendChild(wordSpan);
                        if (wordIdx < words.length - 1) {
                            lineContainer.appendChild(document.createTextNode(' '));
                        }
                    });
                    target.appendChild(lineContainer);
                } else if (node.nodeName === 'BR') {
                    // BR is ignored because the line Containers are display: block
                }
            });
        });
    };

    // Initialize animations
    splitTextIntoChars();
    setTimeout(() => {
        if (allSections[0]) allSections[0].classList.add('animate');
    }, 500);

    // Section transition logic
    const navigateToSection = (index) => {
        if (index === currentSectionIndex || isTransitioning) return;
        if (index < 0 || index >= sections.length) return;

        isTransitioning = true;
        const nextSectionName = sections[index];
        transitionTitle.textContent = nextSectionName;

        // Start overlay animation
        overlay.classList.add('active');

        // Swap sections midway through animation
        setTimeout(() => {
            // Deactivate current
            allSections[currentSectionIndex].classList.remove('active');
            allSections[currentSectionIndex].classList.remove('animate');
            navItems[currentSectionIndex].classList.remove('active');

            // Activate next
            currentSectionIndex = index;
            allSections[currentSectionIndex].classList.add('active');
            
            // Check for specific nav item to activate (avoiding non-section items like CV)
            const targetNav = document.querySelector(`.nav-item[data-section="${nextSectionName}"]`);
            if (targetNav) targetNav.classList.add('active');

            // Slide overlay out
            setTimeout(() => {
                overlay.classList.remove('active');
                
                // Trigger character animation after overlay is gone
                setTimeout(() => {
                    allSections[currentSectionIndex].classList.add('animate');
                    isTransitioning = false;
                }, 100);
            }, 500);
        }, 400);
    };

    // Handle Navbar Clicks
    navItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            const sectionName = item.getAttribute('data-section');
            if (sectionName) {
                e.preventDefault();
                const targetIndex = sections.indexOf(sectionName);
                if (targetIndex !== -1) navigateToSection(targetIndex);
            }
        });
    });

    // Theme Toggle Logic with Wipe Animation
    const themeToggle = document.getElementById('theme-toggle');
    const themeWipe = document.getElementById('theme-wipe');

    const updateFavicon = (theme) => {
        const favicon = document.getElementById('favicon');
        if (favicon) {
            favicon.href = theme === 'dark' 
                ? 'assets/logos/darkmodelogotransparent.png' 
                : 'assets/logos/whitemodelogotransparent.png';
        }
    };

    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        const theme = savedTheme === 'dark' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        updateFavicon(theme);
    };

    if (themeToggle && themeWipe) {
        themeToggle.addEventListener('click', (e) => {
            const rect = themeToggle.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            
            themeWipe.style.transition = 'none';
            themeWipe.style.setProperty('--wipe-x', `${x}px`);
            themeWipe.style.setProperty('--wipe-y', `${y}px`);

            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            const targetBg = targetTheme === 'dark' ? '#0A0F0B' : '#FFFFFF';
            themeWipe.style.backgroundColor = targetBg;
            themeWipe.style.display = 'block'; // Ensure it's not display:none initially
            
            // Trigger reflow to ensure display change applies before transition
            void themeWipe.offsetWidth;
            themeWipe.style.transition = '';
            
            themeWipe.classList.add('active');
            
            // Instantly apply the theme change so the background doesn't transition late
            document.documentElement.setAttribute('data-theme', targetTheme);
            document.body.setAttribute('data-theme', targetTheme);
            localStorage.setItem('theme', targetTheme);
            updateFavicon(targetTheme);
            
            setTimeout(() => {
                themeWipe.classList.remove('active');
                
                // Cleanup inline styles completely after transition
                setTimeout(() => {
                    themeWipe.style.backgroundColor = '';
                    themeWipe.style.display = 'none';
                }, 800); // 800ms matches the CSS transition length
            }, 500);
        });
    }

    // Cross-Tab Sync: Make it work perfectly across all open windows/instances
    window.addEventListener('storage', (e) => {
        if (e.key === 'theme') {
            const newTheme = e.newValue || 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            updateFavicon(newTheme);
        }
    });

    initTheme();

    // Handle Scroll/Wheel
    let lastScrollTime = 0;
    const scrollCooldown = 1500; // ms

    window.addEventListener('wheel', (e) => {
        const now = Date.now();
        if (now - lastScrollTime < scrollCooldown || isTransitioning) return;

        if (e.deltaY > 50) {
            // Scroll down -> Next
            if (currentSectionIndex < sections.length - 1) {
                lastScrollTime = now;
                navigateToSection(currentSectionIndex + 1);
            }
        } else if (e.deltaY < -50) {
            // Scroll up -> Previous
            if (currentSectionIndex > 0) {
                lastScrollTime = now;
                navigateToSection(currentSectionIndex - 1);
            }
        }
    });

    // Handle Touch (Mobile)
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });

    window.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastScrollTime < scrollCooldown || isTransitioning) return;
        
        const touchEndY = e.changedTouches[0].clientY;
        const deltaY = touchStartY - touchEndY;

        if (Math.abs(deltaY) > 100) {
            if (deltaY > 0) {
                // Swipe up -> Next
                if (currentSectionIndex < sections.length - 1) {
                    lastScrollTime = now;
                    navigateToSection(currentSectionIndex + 1);
                }
            } else {
                // Swipe down -> Previous
                if (currentSectionIndex > 0) {
                    lastScrollTime = now;
                    navigateToSection(currentSectionIndex - 1);
                }
            }
        }
    });

    // Projects Button in Hero
    const nextBtn = document.getElementById('next-section-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            navigateToSection(2); // Jump to Projects
        });
    }

    // Stagger logic for Stack page items
    const style = document.createElement('style');
    style.textContent = `
        .stack-item { opacity: 0; transform: translateY(20px); transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .section.animate .stack-item { opacity: 1; transform: translateY(0); }
    `;
    document.head.appendChild(style);

    // Taalomy Slider Logic
    const initTaalomySlider = () => {
        const slides = document.querySelectorAll('#taalomy-slider .slide');
        if (slides.length === 0) return;

        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 3000);
    };
    initTaalomySlider();

    // 1. Local Time Clock (Riyadh/Jeddah)
    const initClock = () => {
        const timeElement = document.getElementById('local-time');
        if (!timeElement) return;
        
        const updateClock = () => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-GB', {
                timeZone: 'Asia/Riyadh',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
            timeElement.textContent = `${timeStr} GMT+3`;
        };
        updateClock();
        setInterval(updateClock, 1000);
    };
    initClock();


});
