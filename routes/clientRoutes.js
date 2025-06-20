import express from 'express';
const router = express.Router();

// Route for /clients page
router.get('/', (req, res) => {
  // Data for clients page (if any specific data is needed)
  // For now, just rendering the template with a title and year
  res.render('clients', {
    title: 'Our Clients - Shuton Studio', // Added a specific title
    year: new Date().getFullYear() // For footer consistency
  });
});

export default router;
