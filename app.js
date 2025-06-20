import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Explicitly set views directory

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`Request URL: ${req.url}`);
  next(); // Continue to next middleware or route handler
});

// Serve static files (CSS, images, etc.)
// The first one is more specific and generally preferred.
app.use(express.static(path.join(__dirname, 'public')));
// The second one is redundant if the first one is working correctly.
// app.use(express.static('public')); // Can be removed if the above line correctly serves from 'public'

// Middleware for parsing application/x-www-form-urlencoded (for form submissions)
app.use(express.urlencoded({ extended: true }));
// Middleware for parsing application/json
app.use(express.json());

// Import routes
import indexRoutes from './routes/indexRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import workRoutes from './routes/workRoutes.js';

// Use routes
app.use('/', indexRoutes);
app.use('/gallery', galleryRoutes);
app.use('/blog', blogRoutes);
app.use('/contact', contactRoutes); // Handles GET /contact and POST /contact/send-message
app.use('/clients', clientRoutes);
app.use('/work', workRoutes);

// 404 Handler - Must be after all routes
app.use((req, res, next) => {
  res.status(404).render('404', { // Assuming a 404.ejs template exists or will be created
    title: 'Page Not Found',
    year: new Date().getFullYear()
  });
});

// Global Error Handler - Must be the last piece of middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { // Assuming an error.ejs template exists or will be created
    title: 'Server Error',
    message: 'Something went wrong on our end. Please try again later.',
    year: new Date().getFullYear()
   });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
