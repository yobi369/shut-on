const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.disable('x-powered-by');

// Basic hardening without adding a middleware dependency.
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (isProduction) res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

app.use(express.urlencoded({ extended: false, limit: '32kb' }));
app.use(express.json({ limit: '32kb' }));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: isProduction ? '1d' : 0 }));

// Public configuration only: the Supabase anon/publishable key is designed to be
// exposed in browsers. Never put a service-role key or private secret here.
app.get('/admin-config.js', (req, res) => {
  res.type('application/javascript');
  res.setHeader('Cache-Control', 'no-store');
  res.send(
    'window.SHUTON_CONFIG = ' + JSON.stringify({
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || ''
    }).replace(/</g, '\\u003c') + ';'
  );
});

app.get('/admin', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.render('admin', { title: 'Studio Admin | Shuton Photography' });
});

async function getPublishedPhotos() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const response = await fetch(
      url.replace(/\/$/, '') + '/rest/v1/photos?select=id,title,description,category,image_url,alt_text,is_featured,sort_order&is_published=eq.true&order=sort_order.asc,created_at.desc',
      { headers: { apikey: key, Authorization: 'Bearer ' + key } }
    );
    if (!response.ok) {
      console.error('Unable to load published photos from the gallery service:', response.status);
      return [];
    }
    const rows = await response.json();
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error('Gallery service unavailable:', error.message);
    return [];
  }
}

app.get('/work', async (req, res) => {
  const photos = await getPublishedPhotos();
  res.render('work', { photos });
});

const blogPosts = [
  { title: 'First Blog Post', image: '/images/post1.jpg', description: 'This is a description for the first blog post.', publishedDate: '2024-09-01', comments: 5, slug: 'first-blog-post' },
  { title: 'Second Blog Post', image: '/images/post2.jpg', description: 'This is a description for the second blog post.', publishedDate: '2024-09-15', comments: 3, slug: 'second-blog-post' }
];

app.get('/blog', (req, res) => {
  res.render('blog', {
    title: 'Blog - Shuton Studio',
    siteName: 'Shuton Photography',
    blogPosts,
    address: 'Opposite - Distar Hotel, Voi',
    phone: '+254 700 000 000',
    email: 'info@shutonstudio.com',
    hours: 'Mon - Fri: 9am - 5pm',
    year: new Date().getFullYear()
  });
});

app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact Us - Shuton Studio', year: new Date().getFullYear() });
});

app.post('/send-message', (req, res) => {
  const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
  const email = typeof req.body.email === 'string' ? req.body.email.trim() : '';
  const message = typeof req.body.message === 'string' ? req.body.message.trim() : '';
  if (!name || !email || !message || name.length > 120 || email.length > 254 || message.length > 5000) {
    return res.status(400).send('Please provide a valid name, email and message.');
  }
  // This endpoint validates submissions but does not deliver email yet. Connect a
  // trusted mail provider before representing it as a working contact-delivery flow.
  console.log('Contact enquiry received:', { name, email, messageLength: message.length });
  return res.status(202).send('Your enquiry has been received. Please contact the studio directly if you need an immediate response.');
});

app.get('/gallery', async (req, res) => {
  const photos = await getPublishedPhotos();
  const images = photos.length
    ? photos.map((photo) => ({ src: photo.image_url, alt: photo.alt_text || photo.title || 'Shuton Photography image' }))
    : [
        { src: '/images/gallery1.jpg', alt: 'Gallery photograph 1' },
        { src: '/images/gallery2.jpg', alt: 'Gallery photograph 2' },
        { src: '/images/gallery3.jpg', alt: 'Gallery photograph 3' },
        { src: '/images/gallery4.jpg', alt: 'Gallery photograph 4' },
        { src: '/images/gallery5.jpg', alt: 'Gallery photograph 5' },
        { src: '/images/gallery6.jpg', alt: 'Gallery photograph 6' },
        { src: '/images/gallery7.jpg', alt: 'Gallery photograph 7' },
        { src: '/images/gallery8.jpg', alt: 'Gallery photograph 8' },
        { src: '/images/gallery9.jpg', alt: 'Gallery photograph 9' }
      ];
  res.render('gallery', { title: 'Gallery', images });
});

app.get('/', (req, res) => {
  res.render('index', {
    pageTitle: 'Shuton Photography - Home',
    logoPath: '/images/logo.png',
    siteName: 'Shuton Photography',
    activePage: 'home',
    headerTitle: 'Capture Your Moments with Shuton Photography',
    headerDescription: 'Professional photography and videography services in Taita Taveta, Kenya',
    images: [
      { path: '/images/slider1.jpg', alt: 'First Slide' },
      { path: '/images/slider2.jpg', alt: 'Second Slide' },
      { path: '/images/slider3.jpg', alt: 'Third Slide' },
      { path: '/images/slider4.jpg', alt: 'Fourth Slide' }
    ],
    aboutImage: '/images/who-we-are.jpg',
    aboutDescription: 'Shuton Photography specializes in commercial photography and videography. Located in Taita Taveta, Kenya, we bring a unique perspective to every project.',
    services: [
      { image: '/images/video-coverage.jpg', title: 'Video Coverage', description: 'High-quality video production for your events and projects.' },
      { image: '/images/livestreaming.jpg', title: 'Livestreaming', description: 'Engage your audience with professional livestreaming services.' },
      { image: '/images/digital-content.jpg', title: 'Digital Content', description: 'Create compelling digital content to showcase your brand.' },
      { image: '/images/still-photography.jpg', title: 'Still Photography', description: 'Capture stunning photographs for your projects and events.' }
    ],
    contactEmail: 'shutonphotography@gmail.com',
    contactPhone: '0758926530 / 0722462645',
    socialLinks: [
      { url: '#', icon: 'facebook' },
      { url: '#', icon: 'instagram' },
      { url: '#', icon: 'twitter' }
    ]
  });
});

app.get('/clients', (req, res) => res.render('clients'));

app.get('/healthz', (req, res) => res.status(200).json({ status: 'ok' }));

// Vercel imports the Express app; local development starts a listener.
if (require.main === module) {
  app.listen(PORT, () => console.log('Shuton Photography listening on port ' + PORT));
}

module.exports = app;
