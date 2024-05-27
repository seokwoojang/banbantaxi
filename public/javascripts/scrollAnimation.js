document.addEventListener("DOMContentLoaded", function() {
    const images = document.querySelectorAll('.scroll-image');

    function checkScroll() {
        const triggerBottom = window.innerHeight / 5 * 4;

        images.forEach(image => {
            const imageTop = image.getBoundingClientRect().top;

            if (imageTop < triggerBottom) {
                image.classList.add('visible');
            } else {
                image.classList.remove('visible');
            }
        });
    }

    window.addEventListener('scroll', checkScroll);

    // Initial check in case images are already in view
    checkScroll();
});
