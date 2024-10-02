const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');


//
app.use((req, res, next) => {
    console.log(`Request URL: ${req.url}`);
    next();  // Continue to next middleware or route handler
});


// Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static('public'));

// Define routes



// Route for /work page
app.get('/work', (req, res) => {
    res.render('work'); // This will render views/gallery.ejs
});



// blog
// Sample data to pass to the EJS template
const blogPosts = [
    
    {
        title: "First Blog Post",
        image: "/images/post1.jpg",
        description: "This is a description for the first blog post.",
        publishedDate: "2024-09-01",
        comments: 5,
        slug: "first-blog-post"
    },
    {
        title: "Second Blog Post",
        image: "/images/post2.jpg",
        description: "This is a description for the second blog post.",
        publishedDate: "2024-09-15",
        comments: 3,
        slug: "second-blog-post"
    }
];

app.get('/blog', (req, res) => {
    res.render('blog', {
        title: "Blog - Shuton Studio",
        siteName: "Shuton Photography",
        blogPosts: blogPosts,
        address: "Opposite - Distar Hotel, Voi",
        phone: "+254 700 000 000",
        email: "info@shutonstudio.com",
        hours: "Mon - Fri: 9am - 5pm",
        year: new Date().getFullYear()
    });
});

// contact

// Route handler for contact page
app.get('/contact', (req, res) => {
    res.render('contact', {
      title: 'Contact Us - Shuton Studio',
      year: new Date().getFullYear(),
    });
  });
  
  // Route handler for sending message
  app.post('/send-message', (req, res) => {
    const { name, email, message } = req.body;
  
    // Validate form fields
    if (!name || !email || !message) {
      res.status(400).send('Please fill in all fields');
      return;
    }
  
    // Send message (e.g., via email or SMS)
    // For demonstration purposes, just log the message to the console
    console.log(`Received message from ${name} (${email}): ${message}`);
  
    res.send('Message sent successfully');
  });
//gallery
app.get('/gallery', (req, res) => {
    const images = [
        { src: 'header1.jpg', alt: 'A beautiful landscape' },
        { src: 'header2.jpg', alt: 'A stunning sunset' },
        { src: 'header3.jpg', alt: 'City skyline at night' },
        { src: 'header4.jpg', alt: 'Wildlife photography' },
        { src: 'header5.jpg', alt: 'Portrait of a model' },
        { src: 'header6.jpg', alt: 'Nature at its best' },
        { src: 'header7.jpg', alt: 'Adventure photography' },
        { src: 'header8.jpg', alt: 'Family portrait' },
        { src: 'header9.jpg', alt: 'Wedding ceremony' },

    ];
    

    res.render('gallery', { title: 'Gallery', images });
});



//Rendering

app.get('/', (req, res) => {
    res.render('index', {
        pageTitle: 'Shuton Photography - Home',
        logoPath: '/public/images/logo.png',
        siteName: 'Shuton Photography',
        activePage: 'home',
        headerTitle: 'Capture Your Moments with Shuton Photography',
        headerDescription: 'Professional photography and videography services in Taita Taveta, Kenya',
        images: [
            { path: '/public/images/slider1.jpg', alt: 'First Slide' },
            { path: '/public/images/slider2.jpg', alt: 'Second Slide' },
            { path: '/public/images/slider3.jpg', alt: 'Third Slide' },
            { path: '/public/images/slider4.jpg', alt: 'Fourth Slide' }
        ],
        aboutImage: '/public/images/who-we-are.jpg',
        aboutDescription: 'Shuton Photography specializes in commercial photography and videography. Located in Taita Taveta, Kenya, we bring a unique perspective to every project.',
        services: [
            { image: '/public/images/video-coverage.jpg', title: 'Video Coverage', description: 'High-quality video production for your events and projects.' },
            { image: '/public/images/livestreaming.jpg', title: 'Livestreaming', description: 'Engage your audience with professional livestreaming services.' },
            { image: '/public/images/digital-content.jpg', title: 'Digital Content', description: 'Create compelling digital content to showcase your brand.' },
            { image: '/public/images/still-photography.jpg', title: 'Still Photography', description: 'Capture stunning photographs for your projects and events.' }
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

// app.js
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`); // This line will confirm the server is running
});


app.get('/clients', (req, res) => {
    // Assuming you have an EJS template for clients
    res.render('clients');  // Render 'clients.ejs' template
});