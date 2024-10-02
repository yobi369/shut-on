let currentSlide = 0;
const slides = document.querySelectorAll('.slider-item');
const totalSlides = slides.length;

// Function to show the slide based on the currentSlide index
function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) {
            slide.classList.add('active');
        }
    });
}

// Auto-slide every 5 seconds
function autoSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

// Initial slide
showSlide(currentSlide);

// Set interval for sliding effect
setInterval(autoSlide, 5000);
