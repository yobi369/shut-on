import express from 'express';
const router = express.Router();

// Sample data to pass to the EJS template
const blogPostsData = [
  {
    title: 'First Blog Post',
    image: '/images/post1.jpg', // Assuming this image exists
    description: 'This is a description for the first blog post.',
    publishedDate: '2024-09-01',
    comments: 5,
    slug: 'first-blog-post',
  },
  {
    title: 'Second Blog Post',
    image: '/images/post2.jpg', // Assuming this image exists
    description: 'This is a description for the second blog post.',
    publishedDate: '2024-09-15',
    comments: 3,
    slug: 'second-blog-post',
  },
];

// Route for /blog page
router.get('/', (req, res) => {
  res.render('blog', {
    title: 'Blog - Shuton Studio',
    siteName: 'Shuton Photography',
    blogPosts: blogPostsData,
    address: 'Opposite - Distar Hotel, Voi', // This seems like footer data
    phone: '+254 700 000 000', // This seems like footer data
    email: 'info@shutonstudio.com', // This seems like footer data
    hours: 'Mon - Fri: 9am - 5pm', // This seems like footer data
    year: new Date().getFullYear(),
  });
});

export default router;
