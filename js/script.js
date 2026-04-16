document.addEventListener('DOMContentLoaded', () => {
    const sections = ['home', 'stack', 'projects', 'contact'];
    let currentSectionIndex = 0;
    let isTransitioning = false;

    const overlay = document.getElementById('transition-overlay');
    const transitionTitle = document.getElementById('transition-title');
    const navItems = document.querySelectorAll('.nav-item');
    const allSections = document.querySelectorAll('.section');

    const translations = {
        'en': {
            'nav-home': 'Home', 'nav-stack': 'Stack', 'nav-projects': 'Projects', 'nav-contact': 'Contact', 'nav-lang': 'العربية',
            'hero-intro': 'THIS IS', 'hero-name': 'AHMAD<br>AL ZUHAIR', 'hero-role': 'LEAD FRONTEND & AI OPS ENGINEER',
            'status-available': 'Available', 'btn-projects': 'Projects', 'heading-stack': 'Tech Stack',
            'projects-intro': 'CHALLENGE & IMPACT', 'projects-title': 'FEATURED ENGINEERING',
            'taalomy-tag': 'FEATURED WORK', 'taalomy-name': 'Taalomy', 'taalomy-role': 'Lead Full-Stack Engineer',
            'taalomy-brief': 'A comprehensive EdTech platform connecting institutions via a Dual-App Mobile Ecosystem. Redefining academic engagement through real-time data sync and institutional optimization.',
            'taalomy-b1': 'Dual-app ecosystem for Students and Lecturers built with React Native (Expo).',
            'taalomy-b2': 'Real-time attendance tracking via WebSockets (Django Channels).',
            'taalomy-b3': 'Integrated timetables and secure academic record management.',
            'link-site': 'Main Site', 'link-student': 'Student Portal', 'link-lecturer': 'Lecturer Portal',
            'p-eco': 'ECOSYSTEM', 'p-tareekna': 'Lead Frontend for a ride-sharing powerhouse. Real-time tracking and fare estimation for User, Driver, and Admin apps.',
            'p-tele': 'TELEMETRY', 'p-mazraty': 'Remote farm monitoring system providing real-time telemetry and push notifications for agricultural optimization.',
            'p-corp': 'CORPORATE', 'p-sfd': 'High-performance corporate site featuring deep theme customization and an integrated conversational AI assistant.',
            'p-intel': 'INTELLIGENCE', 'p-agents': '40+ specialized agents developed in TypeScript for social content, blogs, and narrative-to-image automation.',
            'contact-intro': 'OPPORTUNITIES & COLLABS', 'contact-title': 'LET\'S<br>CONNECT',
            'c-about-h': 'About Me', 'c-about-p': 'Lead Frontend Developer & AI Ops Engineer at SFD. I specialize in crafting intuitive interfaces and architecting AI solutions that bridge the gap between complex technology and human experience.',
            'c-vision-h': 'Vision', 'c-vision-p': 'To transform cutting-edge AI into seamless, accessible daily experiences that empower users and redefine digital interaction through advanced UI/UX and intelligent automation.',
            'c-mission-h': 'Mission', 'c-mission-p': 'Engineering robust, scalable, and high-performance systems with a relentless focus on engineering rigor, design excellence, and real-world impact in the global and Saudi tech sectors.',
            'contact-direct': 'Direct Reach', 'contact-follow': 'Connect & Follow', 'location': 'RIYADH, KSA',
            'link-linkedin': 'LinkedIn', 'link-github': 'GitHub', 'link-ai': 'AI Assistant',
            'cv-summary-title': 'Executive Summary', 'cv-summary-text': 'Dedicated and innovative developer with dual expertise in AI Operations Engineering and Frontend Development. Specializing in designing intuitive interfaces and developing tailored AI solutions for the Middle Eastern market.',
            'cv-edu-title': 'Education', 'cv-edu-1-h': 'B.Eng in Computer Engineering', 'cv-edu-1-p': 'Asia Pacific University (APU) — 2025', 'cv-edu-2-h': 'Bachelor\'s Studies', 'cv-edu-2-p': 'De Montfort University (DMU), UK',
            'cv-philo-title': 'Philosophy', 'cv-p1': 'Product Thinking over pure coding', 'cv-p2': 'Architecture with Typed Boundaries', 'cv-p3': 'Composition over Inheritance',
            'cv-journey-title': 'Professional Journey', 'cv-exp1-h': 'Lead Frontend Developer | SFD', 'cv-exp1-p': 'Architected the Tareekna Ecosystem (User, Driver, Admin) and the Acadex institutional platform. Leveraged React Native, Expo, and WebSockets for real-time telemetry.',
            'cv-exp2-h': 'Junior AI Ops Engineer | Devan & Co', 'cv-exp2-p': 'Developed a suite of 40+ specialized AI agents. Fine-tuned and deployed LLMs (Llama, Qwen) at scale for social and marketing automation.',
            'cv-exp3-h': 'Technical Assistant | APU', 'cv-exp3-p': 'Managed IT infrastructure and resolved systems issues for university laboratories.',
            'cv-tech-title': 'Technical Command', 'cv-download': 'Download PDF Version',
            'utc': 'UTC+03:00'
        },
        'ar': {
            'nav-home': 'الرئيسية', 'nav-stack': 'التقنيات', 'nav-projects': 'المشاريع', 'nav-contact': 'اتصل بي', 'nav-lang': 'English',
            'hero-intro': 'أهلاً بك، أنا', 'hero-name': 'أحمد<br>الزهير', 'hero-role': 'رئيس مطوري الواجهات الأمامية ومهندس ذكاء اصطناعي',
            'status-available': 'متاح للعمل', 'btn-projects': 'المشاريع', 'heading-stack': 'القدرات التقنية',
            'projects-intro': 'التحدي والأثر', 'projects-title': 'الهندسة المتميزة',
            'taalomy-tag': 'عمل مختار', 'taalomy-name': 'تعلمي', 'taalomy-role': 'رئيس مهندسي التطوير (Full-Stack)',
            'taalomy-brief': 'منصة تعليمية متكاملة تربط المؤسسات عبر نظام تطبيقات الهاتف المزدوج. إعادة تعريف التفاعل الأكاديمي من خلال مزامنة البيانات في الوقت الفعلي وتحسين المؤسسات.',
            'taalomy-b1': 'نظام تطبيقات مزدوج للطلاب والمحاضرين بني باستخدام React Native.',
            'taalomy-b2': 'تتبع الحضور اللحظي عبر WebSockets.',
            'taalomy-b3': 'جداول زمنية مدمجة وإدارة سجلات آمنة.',
            'link-site': 'الموقع الرئيسي', 'link-student': 'بوابة الطالب', 'link-lecturer': 'بوابة المحاضر',
            'p-eco': 'نظام بيئي', 'p-tareekna': 'رئيس مطوري الواجهات لمنصة Tareekna. تتبع في الوقت الفعلي وتقدير الأجرة لتطبيقات المستخدم والسائق والمسؤول.',
            'p-tele': 'القياس عن بُعد', 'p-mazraty': 'نظام مراقبة المزارع عن بُعد يوفر بيانات القياس في الوقت الفعلي وإشعارات لتحسين الزراعة.',
            'p-corp': 'مؤسسي', 'p-sfd': 'موقع مؤسسي عالي الأداء يتميز بتخصيص عميق للثيم ومساعد ذكاء اصطناعي محادث مدمج.',
            'p-intel': 'ذكاء', 'p-agents': 'أكثر من 40 وكيلاً متخصصاً تم تطويرهم بلغة TypeScript للمحتوى الاجتماعي والمدونات والأتمتة.',
            'contact-intro': 'الفرص والتعاون', 'contact-title': 'لنتواصل<br>',
            'c-about-h': 'من أنا', 'c-about-p': 'رئيس مطوري الواجهة الأمامية ومهندس عمليات الذكاء الاصطناعي في SFD. أتخصص في صياغة واجهات بديهية وبناء حلول ذكاء اصطناعي تربط بين التكنولوجيا المعقدة والتجربة البشرية.',
            'c-vision-h': 'الرؤية', 'c-vision-p': 'تحويل الذكاء الاصطناعي المتطور إلى تجارب يومية سلسة ومتاحة تمكن المستخدمين وتعيد تعريف التفاعل الرقمي من خلال واجهة مستخدم متقدمة وأتمتة ذكية.',
            'c-mission-h': 'المهمة', 'c-mission-p': 'هندسة وأنظمة قوية وقابلة للتطوير وعالية الأداء مع تركيز لا يلين على الصرامة الهندسية وتميز التصميم والأثر الحقيقي في القطاعات التقنية العالمية والسعودية.',
            'contact-direct': 'التواصل المباشر', 'contact-follow': 'تابعني وتواصل معي', 'location': 'الرياض، المملكة العربية السعودية',
            'link-linkedin': 'لينكد إن', 'link-github': 'جيت هاب', 'link-ai': 'مساعد الذكاء الاصطناعي',
            'cv-summary-title': 'الملخص التنفيذي', 'cv-summary-text': 'مطور مبتكر متخصص مع خبرة مزدوجة في هندسة عمليات الذكاء الاصطناعي وتطوير الواجهات الأمامية. متخصص في تصميم واجهات بديهية وتطوير حلول ذكاء اصطناعي مخصصة للسوق الشرق أوسطي.',
            'cv-edu-title': 'التعليم', 'cv-edu-1-h': 'بكالوريوس هندسة الحاسوب', 'cv-edu-1-p': 'جامعة آسيا والمحيط الهادئ (APU) - 2025', 'cv-edu-2-h': 'دراسات البكالوريوس', 'cv-edu-2-p': 'جامعة دي مونتفورت (DMU)، المملكة المتحدة',
            'cv-philo-title': 'الفلسفة الهندسية', 'cv-p1': 'التفكير في المنتج قبل الكود', 'cv-p2': 'بنية برمجية بحدود واضحة النوع', 'cv-p3': 'التركيب بدلاً من الوراثة البرمجية',
            'cv-journey-title': 'الرحلة المهنية', 'cv-exp1-h': 'رئيس مطوري الواجهة الأمامية | SFD', 'cv-exp1-p': 'هندسة نظام Tareekna البيئي وبوابة Acadex المؤسسية. استخدام React Native و WebSockets للقياس عن بُعد في الوقت الفعلي.',
            'cv-exp2-h': 'مهندس عمليات ذكاء اصطناعي | Devan & Co', 'cv-exp2-p': 'تطوير مجموعة من 40+ وكيلاً ذكياً. ضبط ونشر نماذج اللغات الكبيرة (Llama, Qwen) على نطاق واسع.',
            'cv-exp3-h': 'مساعد تقني | جامعة APU', 'cv-exp3-p': 'إدارة البنية التحتية لتكنولوجيا المعلومات وحل مشكلات الأنظمة للمختبرات الجامعية.',
            'cv-tech-title': 'القيادة التقنية', 'cv-download': 'تحميل نسخة PDF',
            'utc': 'التوقيت العالمي +٠٣:٠٠'
        }
    };

    // Utility: Split text into characters (Robust version for symbols & entities)
    const splitTextIntoChars = () => {
        const targets = document.querySelectorAll('.main-title, .accent-text, .section-heading');
        targets.forEach(target => {
            // First, get clean content
            const decoder = document.createElement('div');
            decoder.innerHTML = target.innerHTML;
            const nodes = Array.from(decoder.childNodes);

            // Skip character splitting for Arabic to keep it legible (cursive)
            if (document.documentElement.lang === 'ar') {
                target.innerHTML = decoder.innerHTML;
                target.style.opacity = '1';
                return;
            }

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
        const currentLang = document.documentElement.lang || 'en';
        const transKey = `nav-${nextSectionName}`;

        transitionTitle.textContent = (translations[currentLang] && translations[currentLang][transKey])
            ? translations[currentLang][transKey]
            : nextSectionName.toUpperCase();

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

            // Update Meta Theme Color for Edge-to-Edge
            const metaTheme = document.getElementById('meta-theme-color');
            if (metaTheme) metaTheme.setAttribute('content', targetBg);

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

    // Global main-content transition
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.style.transition = 'opacity 0.3s ease';
    }

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
            const currentLang = document.documentElement.lang || 'en';
            const suffix = currentLang === 'ar' ? ' ت.غ+٣' : ' GMT+3';
            timeElement.textContent = `${timeStr}${suffix}`;
        };
        updateClock();
        setInterval(updateClock, 1000);
    };
    initClock();


    // Language Switching Logic
    const langToggle = document.getElementById('lang-toggle');
    const langCode = langToggle ? langToggle.querySelector('.lang-code') : null;

    const setLanguage = (lang) => {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

        if (langCode) langCode.textContent = lang === 'ar' ? 'EN' : 'AR';

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });

        // Re-split and re-animate if on desktop
        splitTextIntoChars();
        if (allSections[currentSectionIndex]) {
            allSections[currentSectionIndex].classList.remove('animate');
            void allSections[currentSectionIndex].offsetWidth;
            allSections[currentSectionIndex].classList.add('animate');
        }

        localStorage.setItem('preferred-lang', lang);
    };

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            if (isTransitioning) return;

            const newLang = document.documentElement.lang === 'en' ? 'ar' : 'en';

            // Start smooth transition sequence
            isTransitioning = true;
            transitionTitle.textContent = newLang === 'ar' ? 'العربية' : 'ENGLISH';
            overlay.classList.add('active');

            // Mid-wipe swap
            setTimeout(() => {
                const main = document.getElementById('main-content');
                if (main) main.style.opacity = '0';

                setLanguage(newLang);

                // Final reveal
                setTimeout(() => {
                    if (main) main.style.opacity = '1';
                    overlay.classList.remove('active');
                    isTransitioning = false;
                }, 500);
            }, 400);
        });
    }

    // Init Language
    const savedLang = localStorage.getItem('preferred-lang') || 'en';
    if (savedLang !== 'en') setLanguage(savedLang);

    // Digital CV Toggle Logic
    const cvTrigger = document.getElementById('cv-trigger');
    const cvOverlay = document.getElementById('cv-overlay');
    const cvClose = document.getElementById('cv-close');

    if (cvTrigger && cvOverlay && cvClose) {
        cvTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            cvOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock main scroll
        });

        const closeCV = () => {
            cvOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore main scroll
        };

        cvClose.addEventListener('click', closeCV);

        // Close on background click
        cvOverlay.addEventListener('click', (e) => {
            if (e.target === cvOverlay) closeCV();
        });

        // Close on Esc key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && cvOverlay.classList.contains('active')) {
                closeCV();
            }
        });
    }
});
