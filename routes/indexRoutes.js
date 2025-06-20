import express from 'express';
const router = express.Router();

// Data for the home page (can be moved to a controller or service later if it grows)
const homePageData = {
  pageTitle: 'Shuton Photography - Home',
  logoPath: '/images/logo.png', // Adjusted path, assuming 'public' is static root
  siteName: 'Shuton Photography',
  activePage: 'home',
  headerTitle: 'Capture Your Moments with Shuton Photography',
  headerDescription:
    'Professional photography and videography services in Taita Taveta, Kenya',
  sliderImages: [ // Renamed from 'images' to be more specific
    { path: '/images/image1.jpg', alt: 'First Slide' }, // Adjusted path
    { path: '/images/image2.jpg', alt: 'Second Slide' }, // Adjusted path
    { path: '/images/image3.jpg', alt: 'Third Slide' }, // Adjusted path
    // { path: '/public/images/slider4.jpg', alt: 'Fourth Slide' }, // This was likely a typo, assuming image4.jpg
  ],
  aboutImage: '/images/about.jpg', // Adjusted path
  aboutDescription:
    'Shuton Photography specializes in commercial photography and videography. Located in Taita Taveta, Kenya, we bring a unique perspective to every project.',
  services: [
    {
      image: '/images/service1.jpg', // Adjusted path
      title: 'Wedding Photography', // Updated to match index.ejs more closely
      description:
        'High-quality video production for your events and projects.',
    },
    {
      image: '/images/service2.jpg', // Adjusted path
      title: 'Corporate Photography', // Updated to match index.ejs
      description:
        'Engage your audience with professional livestreaming services.',
    },
    {
      image: '/images/service3.jpg', // Adjusted path
      title: 'Studio Photography', // Updated to match index.ejs
      description:
        'Create compelling digital content to showcase your brand.',
    },
    {
      image: '/images/service4.jpg', // Adjusted path
      title: 'Nature & Travel Photography', // Updated to match index.ejs
      description:
        'Capture stunning photographs for your projects and events.',
    },
  ],
  contactEmail: 'shutonphotography@gmail.com',
  contactPhone: '0758926530 / 0722462645',
  socialLinks: [
    { url: '#', icon: 'facebook' },
    { url: '#', icon: 'instagram' },
    { url: '#', icon: 'twitter' },
  ],
  year: new Date().getFullYear()
};

// Route for the home page
router.get('/', (req, res) => {
  res.render('index', homePageData);
});

export default router;
