import express from 'express';
const router = express.Router();

const galleryImages = [
  { src: 'header1.jpg', alt: 'A beautiful landscape' },
  { src: 'header2.jpg', alt: 'A stunning sunset' },
  { src: 'header3.jpg', alt: 'City skyline at night' },
  { src: 'header4.jpg', alt: 'Wildlife photography' },
  { src: 'header5.jpg', alt: 'Portrait of a model' },
  // { src: 'header6.jpg', alt: 'Nature at its best' }, // In app.js but not in index.ejs portfolio
  // { src: 'header7.jpg', alt: 'Adventure photography' }, // In app.js but not in index.ejs portfolio
  // { src: 'header8.jpg', alt: 'Family portrait' }, // In app.js but not in index.ejs portfolio
  // { src: 'header9.jpg', alt: 'Wedding ceremony' }, // In app.js but not in index.ejs portfolio
  // From index.ejs, assuming these map to gallery items. Paths will need /images/ prefix
  { src: 'wed.jpg', alt: 'Wedding Photography' },
  { src: 'corporate2.jpg', alt: 'Corporate Event Photography' },
  { src: 'graduation1.jpg', alt: 'Graduation Photography' },
];

// Route for /gallery page
router.get('/', (req, res) => {
  // Prefixing image sources with /images/ for consistency with static serving
  const imagesWithCorrectPaths = galleryImages.map(img => ({
    ...img,
    src: `/images/${img.src}`
  }));
  res.render('gallery', {
    title: 'Gallery - Shuton Studio', // Added a more specific title
    images: imagesWithCorrectPaths,
    year: new Date().getFullYear() // For footer consistency
  });
});

export default router;
