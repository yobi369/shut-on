import express from 'express';
const router = express.Router();

// Route handler for contact page
router.get('/', (req, res) => {
  res.render('contact', {
    title: 'Contact Us - Shuton Studio',
    year: new Date().getFullYear(),
  });
});

// Route handler for sending message
router.post('/send-message', (req, res) => {
  const { name, email, message } = req.body;

  // Basic validation (will be improved in a later step)
  if (!name || !email || !message) {
    // It's better to re-render the form with an error message
    // For now, just sending a status, will improve later
    return res.status(400).render('contact', {
      title: 'Contact Us - Shuton Studio',
      year: new Date().getFullYear(),
      errorMessage: 'Please fill in all fields.',
      formData: req.body // To repopulate the form
    });
  }

  // For demonstration purposes, just log the message to the console
  console.log(`Received message from ${name} (${email}): ${message}`);

  // It's better to redirect to a success page or show a success message on the same page
  // For now, rendering contact page with a success message
  res.render('contact', {
    title: 'Contact Us - Shuton Studio',
    year: new Date().getFullYear(),
    successMessage: 'Message sent successfully! We will get back to you soon.',
  });
});

export default router;
