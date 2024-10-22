"use strict";

let MAX_MEDIA_1200 = window.matchMedia('(max-width: 1200px)').matches;

const initLozad = () => {
    const lozadElements = document.querySelectorAll('[data-lozad]');

    if (!lozadElements) return;

    lozadElements.forEach(element => {
        const lozadObserver = lozad(element);

        lozadObserver.observe();
    })
}

const initCases = () => {
    const casesSection = document.querySelector('.cases');

    if (!casesSection) return

    initCasesSlider();

    function initCasesSlider() {
        const casesSlider = casesSection.querySelector('.cases__slider');
        const casesPrev = casesSection.querySelector('.arrow--prev');
        const casesNext = casesSection.querySelector('.arrow--next');
        const options = {
            slidesPerView: 'auto',
            spaceBetween: 24,
            speed: 1000,
            grabCursor: true,
            navigation: {
                prevEl: casesPrev,
                nextEl: casesNext
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            }
        };

        const casesSliderSwiper = new Swiper(casesSlider, options)
    }
}

const initHeader = () => {
    const header = document.querySelector('.site-header');

    if (!header) return;


    let lastScrollTop;

    window.addEventListener('scroll', toggleScrollingClass);
    window.addEventListener('scroll', animateHeader);

    function animateHeader() {
        const scrollTop = document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > 48) {
            header.classList.add('is-scrolling-down');
        } else {
            header.classList.remove('is-scrolling-down');
        }

        lastScrollTop = scrollTop;
    }

    function toggleScrollingClass() {
        const scrollTop = document.documentElement.scrollTop;

        if (scrollTop > 0) {
            header.classList.add('is-scrolling');
        } else {
            header.classList.remove('is-scrolling');
        }
    }
}

const initBurgerMenu = () => {
    const menu = document.querySelector(".site-header__panel");
    const burger = document.querySelector(".burger");

    if (!menu || !burger) return;

    const menuOverlay = document.querySelector(".site-header__overlay");
    const menuClose = menu.querySelector(".site-header__panel-close");
    const menuAnchors = menu.querySelectorAll('[data-anchor]');

    if (menuClose) menuClose.addEventListener("click", closeBurgerMenu);
    if (menuOverlay) menuOverlay.addEventListener("click", closeBurgerMenu);
    if (menuAnchors) initMenuAnchors();

    burger.addEventListener("click", openBurgerMenu);

    function initMenuAnchors() {
        menuAnchors.forEach(anchor => anchor.addEventListener('click', closeBurgerMenu));
    }

    function closeBurgerMenu() {
        menu.classList.remove("is-open");
        menuOverlay.classList.remove('is-visible');
        document.body.classList.remove('is-lock');
    }

    function openBurgerMenu() {
        menu.classList.add("is-open");
        menuOverlay.classList.add('is-visible');
        document.body.classList.add('is-lock');
    }
};

const initFoldedElements = () => {
    const foldedElements = document.querySelectorAll('[data-fold]');

    if (!foldedElements) return;

    foldedElements.forEach(foldedElement => {
        let foldedElementContent;
        const foldedElementBtn = foldedElement.querySelector('[data-fold-btn]');
        foldedElementContent = foldedElement.querySelectorAll('[data-fold-content]')

        if (foldedElement.classList.contains('is-dropdown')) {
            foldedElementContent = foldedElement.querySelector('[data-fold-content]')
        }

        heightToggleElement(foldedElementBtn, foldedElementContent);
    })
}

const initAccordions = () => {
    const accordions = document.querySelectorAll('[data-accordion]');

    if (!accordions) return;

    accordions.forEach(accordion => {
        const accordionFoldedElements = accordion.querySelectorAll('[data-fold]');

        accordionFoldedElements.forEach((foldedElement, i) => {
            const foldedElementBtn = foldedElement.querySelector('[data-fold-btn]');
            const foldedElementsWithoutCurrent = Array.from(accordionFoldedElements).filter((element, j) => i !== j);

            foldedElementBtn.addEventListener('click', () => closeOtherFoldedElements(foldedElementsWithoutCurrent));
        })

    })

    function closeOtherFoldedElements(foldedElements) {
        foldedElements.forEach(element => {
            const foldedElementBtn = element.querySelector('[data-fold-btn]');
            const foldedElementContent = element.querySelector('[data-fold-content]');

            foldedElementContent.style.height = `${foldedElementContent.scrollHeight}px`;
            window.getComputedStyle(foldedElementContent, null).getPropertyValue("height");
            foldedElementContent.style.height = "0";
            foldedElementBtn.classList.remove("is-active");
            foldedElementContent.classList.remove("is-expanded");

            foldedElementContent.addEventListener("transitionend", () => {
                if (foldedElementContent.style.height !== "0px") {
                    foldedElementContent.style.height = "auto";
                }
            });
        })
    }
}

const initAnchors = () => {
    const anchors = document.querySelectorAll('[data-anchor]');

    if (!anchors) return;

    const header = document.querySelector('.site-header');
    const headerHeight = header.offsetHeight;

    anchors.forEach(link => {

        link.addEventListener('click', function (e) {
            e.preventDefault();

            const href = this.getAttribute('href');
            const scrollTarget = document.querySelector(href);
            const topOffset = headerHeight;
            const elementPosition = scrollTarget.getBoundingClientRect().top;
            const offsetPosition = elementPosition - topOffset;

            window.scrollBy({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });

}

const initAdvantagesAnimation = () => {
    const advantagesSection = document.querySelector('.advantages');

    if (!advantagesSection) return;

    let tl;
    const advantages = advantagesSection.querySelectorAll('.advantages__item');

    initAnimation();
    window.addEventListener('resize', handleAnimation);

    function initAnimation() {
        if (MAX_MEDIA_1200) return;

        gsap.registerPlugin(ScrollTrigger);

        advantagesSection.style.paddingBottom = `${(advantages.length - 1) * 32}px`;

        tl = gsap.timeline({
            defaults: {
                ease: "none",
            },
            scrollTrigger: {
                trigger: advantagesSection,
                start: "top top",
                end: `+=${advantages.length - 1}000`,
                scrub: 1,
                pin: true,
                invalidateOnRefresh: true
            }
        });

        advantages.forEach((advantage, i) => {
            const advantageItems = advantage.querySelectorAll('*');

            if (i !== 0) {
                gsap.set(advantage, { top: `calc(${100 * i}% + ${i * 32}px)` })
                tl.to(advantage, { top: i * 32 })

                advantages.forEach((advantage, j) => {
                    if (j > i) {
                        tl.to(advantage, { top: `calc(${100 * (j - i)}% + ${j * 32}px)` }, '<')
                    }
                })

                tl.to(advantage, { background: '#15286d', duration: 0.5 }, '>')

                if (i & 2 !== 0) {
                    tl.to(advantages[i - 1], { background: '#979797', duration: 0.5 }, '<')
                } else {
                    tl.to(advantages[i - 1], { background: '#F4F4F4', duration: 0.5 }, '<')
                }

                tl.to(advantageItems, { color: '#fff' }, '<')
            } else {
                tl
                    .to(advantage, { background: '#15286d', duration: 0.5 })
                    .to(advantages[i - 1], { background: '#979797', duration: 0.5 }, '<')
                    .to(advantageItems, { color: '#fff', duration: 0.5 }, '<')
                    .to({}, 0.1, {}, '<')
            }
        })
    }

    function handleAnimation() {
        MAX_MEDIA_1200 = window.matchMedia('(max-width: 1200px)').matches;

        if (MAX_MEDIA_1200) {
            if (!tl?.scrollTrigger) return;

            const advantagesSectionPin = advantagesSection.closest('.pin-spacer');

            tl.progress(0);
            tl.kill();
            gsap.set(advantagesSection, { clearProps: 'all' })
            advantages.forEach(advantage => {
                const advantageItems = advantage.querySelectorAll('*');

                gsap.set([advantage, [...advantageItems]], { clearProps: 'all' })
            });
            advantagesSectionPin.insertAdjacentElement('beforebegin', advantagesSection);
            advantagesSectionPin.remove();
        } else if (!tl.scrollTrigger) {
            initAnimation();
        }
    }
}

const initPlaneAnimation = () => {
    const planeSection = document.querySelector('.referral');

    if (!planeSection || !gsap) return;

    let tl;
    const plane = planeSection.querySelector('.referral__plane');

    initAnimation();
    window.addEventListener('resize', handleAnimation);

    function initAnimation() {
        if (MAX_MEDIA_1200) return;

        gsap.registerPlugin(ScrollTrigger);

        tl = gsap.timeline({
            defaults: {
                duration: 4,
                ease: "none",
            },
            scrollTrigger: {
                trigger: planeSection,
                start: "top 80%",
                end: `bottom top`,
                scrub: true,
                invalidateOnRefresh: true
            }
        });

        tl
            .fromTo(plane, { yPercent: -120 }, { yPercent: 120 })
    }

    function handleAnimation() {
        MAX_MEDIA_1200 = window.matchMedia('(max-width: 1200px)').matches;

        if (MAX_MEDIA_1200) {
            if (!tl?.scrollTrigger) return;

            tl.progress(0);
            tl.kill();
            gsap.set(plane, { clearProps: 'all' })
        } else if (!tl?.scrollTrigger) {
            initAnimation();
        }
    }
}

const initPopups = () => {
    const overlay = document.querySelector(".overlay");

    if (!overlay) return;

    initCloseModalsOnClickOverlay();

    const popups = document.querySelectorAll("[data-popup]");
    const popupBtns = document.querySelectorAll("[data-popup-btn]");

    if (!popupBtns && !popups) return;

    popupBtns.forEach((btn) => {
        const popup = overlay.querySelector(`[data-popup=${btn.dataset.popupBtn}]`);

        if (popup) {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                openPopup(popup);
            });
        }
    });

    popups.forEach((popup) => {
        const popupCloses = popup.querySelectorAll("[data-popup-close]");

        if (popupCloses) {
            popupCloses.forEach((close) => {
                close.addEventListener("click", (e) => {
                    closePopup(popup);
                });
            });
        }
    });

    function openPopup(popup) {
        overlay.classList.add("is-visible");
        popup.classList.add("is-visible");
        document.body.classList.add('is-lock');
    }

    function closePopup(popup) {
        overlay.classList.remove("is-visible");
        popup.classList.remove("is-visible");
        document.body.classList.remove('is-lock');
    }

    function initCloseModalsOnClickOverlay() {
        overlay.addEventListener("click", (e) => {
            const { target } = e;

            if (target.classList.contains('overlay')) {
                if (popups) {
                    popups.forEach((popup) => {
                        popup.classList.remove("is-visible");
                    });
                }

                document.body.classList.remove("is-lock");
                overlay.classList.remove("is-visible");
            }
        });
    }
}

const initClientsSlider = () => {
    const clientsSlider = document.querySelector('.clients__slider');

    if (!clientsSlider) return;

    const options = {
        slidesPerView: 'auto',
        spaceBetween: 24,
        loop: true,
        speed: 2000,
        autoplay: {
            delay: 0,
        }
    }

    const clientsSliderSwiper = new Swiper(clientsSlider, options);
}

const initAdvantagesSlider = () => {
    let advantagesSwiper;
    const advantagesBody = document.querySelector('.advantages__body');

    window.addEventListener('resize', handleSlider);

    if (!advantagesBody || !MAX_MEDIA_1200) return;

    const options = {
        slidesPerView: 1,
        spaceBetween: 8,
        speed: 1000,
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        breakpoints: {
            767: {
                enabled: false
            }
        }
    }

    advantagesSwiper = new Swiper(advantagesBody, options);

    function handleSlider() {
        MAX_MEDIA_1200 = window.matchMedia('(max-width: 1200px)').matches;

        if (MAX_MEDIA_1200 && !advantagesSwiper) {
            initAdvantagesSlider();
        }
    }
}

const initRunningLines = () => {
    const runningLines = document.querySelectorAll('.running-lines__row');

    if (!runningLines) return;

    let options = {
        slidesPerView: 'auto',
        spaceBetween: 160,
        speed: 10000,
        loop: true,
        autoplay: {
            delay: 0
        }
    }


    runningLines.forEach(line => {
        if (line.classList.contains('running-lines__row--reverse')) {
            options = {
                ...options,
                autoplay: {
                    ...options.autoplay,
                    reverseDirection: true
                }
            }
        }

        const lineSwiper = new Swiper(line, options);
    })

}

function heightToggleElement(toggler, blocks) {
    toggler.addEventListener("click", (e) => {
        e.preventDefault();

        if (blocks instanceof NodeList) {
            blocks.forEach(function (block) {
                addFunctionality(toggler, block);
            });
        } else {
            addFunctionality(toggler, blocks);
        }
    });

    function addFunctionality(toggler, block) {
        if (block.style.height === "0px" || !block.style.height && !block.classList.contains('is-expanded')) {
            block.style.height = `${block.scrollHeight}px`;
            toggler.classList.add("is-active");
            block.classList.add("is-expanded");
        } else {
            block.style.height = `${block.scrollHeight}px`;
            window.getComputedStyle(block, null).getPropertyValue("height");
            block.style.height = "0";
            toggler.classList.remove("is-active");
            block.classList.remove("is-expanded");
        }

        block.addEventListener("transitionend", () => {
            if (block.style.height !== "0px") {
                block.style.height = "auto";
            }
        });
    }
}

window.addEventListener("DOMContentLoaded", (e) => {
    initLozad();
    initFoldedElements();
    initAccordions();
    initHeader();
    initAnchors();
    initBurgerMenu();
    initCases();
    initPopups();
    initClientsSlider();
    initAdvantagesSlider();
    initAdvantagesAnimation();
    initPlaneAnimation();
    initRunningLines();
});
