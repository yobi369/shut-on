const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Middleware to parse URL-encoded data (form submissions)
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`Request URL: ${req.url}, Method: ${req.method}`);
    next();
});

// Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Define routes

// Route for /work page
app.get('/work', (req, res) => {
    res.render('work', { activePage: 'work' }); // Added activePage
});

// Blog
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
        year: new Date().getFullYear(),
        activePage: 'blog' // Added activePage
    });
});

// Contact Page
app.get('/contact', (req, res) => {
    res.render('contact', {
      title: 'Contact Us - Shuton Studio',
      year: new Date().getFullYear(),
      activePage: 'contact' // Added activePage
    });
});

// Configure nodemailer transporter
// IMPORTANT: Replace with your actual email service details for this to work.
const transporter = nodemailer.createTransport({
    service: 'gmail', // Or your preferred email provider
    auth: {
        user: 'YOUR_EMAIL@gmail.com', // Replace with your email address
        pass: 'YOUR_APP_PASSWORD'    // Replace with your email app password
    }
});

// Route handler for sending message
app.post('/send-message', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).send('Please fill in all fields');
    }

    const mailOptions = {
        from: email,
        to: 'shutonphotography@gmail.com',
        subject: `New Contact Form Message from ${name}`,
        text: `You have received a new message from your website contact form.\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Sorry, there was an error sending your message. Please try again later.');
        }
        console.log('Message sent: %s', info.messageId);
        res.send('Message sent successfully! We will get back to you soon.');
    });
});

// Gallery
app.get('/gallery', (req, res) => {
    const images = [
        { src: '/images/header1.jpg', alt: 'A beautiful landscape' },
        { src: '/images/header2.jpg', alt: 'A stunning sunset' },
        { src: '/images/header3.jpg', alt: 'City skyline at night' },
        { src: '/images/header4.jpg', alt: 'Wildlife photography' },
        { src: '/images/header5.jpg', alt: 'Portrait of a model' },
        { src: '/images/header6.jpg', alt: 'Nature at its best' },
        { src: '/images/header7.jpg', alt: 'Adventure photography' },
        { src: '/images/header8.jpg', alt: 'Family portrait' },
        { src: '/images/header9.jpg', alt: 'Wedding ceremony' },
    ];
    res.render('gallery', { title: 'Gallery', images, activePage: 'gallery' }); // Added activePage
});

// Rendering Home Page
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

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Clients Page
app.get('/clients', (req, res) => {
    res.render('clients', { activePage: 'clients' }); // Added activePage
});
