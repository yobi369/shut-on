import express from 'express';
const router = express.Router();

// Route for /work page
router.get('/', (req, res) => {
  // Data for work page (if any specific data is needed)
  // The original app.js rendered 'work' which might be 'views/work.ejs'
  // Assuming 'work.ejs' exists and is similar to other pages
  res.render('work', {
    title: 'Our Work - Shuton Studio', // Added a specific title
    year: new Date().getFullYear() // For footer consistency
  });
});

export default router;
