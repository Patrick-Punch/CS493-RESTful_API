/*
Patrick Punch
4/13/2025
CS 493
*/
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// fake business data
const businesses = [
  {
    id: '1',
    name: 'Spork',
    address: {
      street: '937 NW Newport Avenue, Suite 130',
      city: 'Bend',
      state: 'OR',
      zip: '97701',
    },
    phone: '(541) 390-0946',
    category: 'Restaurant',
    subcategories: ['Fusion'],
    website: 'https://www.sporkbend.com/menu',
    email: 'spork@sporkbend.com',
  },
  {
    id: '2',
    name: "Ken's Artisan Pizza",
    address: {
      street: '1033 NW Bond Street',
      city: 'Bend',
      state: 'OR',
      zip: '97701',
    },
    phone: '(541) 797-0029',
    category: 'Restaurant',
    subcategories: ['Pizza'],
    website: 'https://kensartisan.com/pizza',
    email: 'email@example.com',
  }
];

// fake review data
let reviews = [
  {
    id: 'review1',
    userId: 'user1',
    businessId: '1',
    stars: 4,
    dollars: 2,
    review: "Great place!"
  },
  {
    id: 'review2',
    userId: 'user1',
    businessId: '2',
    stars: 4,
    dollars: 3,
    review: "Long wait, but worth it!"
  },
  {
    id: 'review3',
    userId: 'user2',
    businessId: '1',
    stars: 5,
    dollars: 2,
    review: "Love the variety!"
  },
  {
    id: 'review4',
    userId: 'user2',
    businessId: '2',
    stars: 4,
    dollars: 4,
    review: "Great atmosphere, a little spendy."
  }
];

// Add Business
app.post('/businesses', (req, res) => {
  const { name, address, phone, category, subcategories } = req.body;

  if (!name || !address || !phone || !category || !subcategories) {
    return res.status(400).send({ error: 'Missing required fields' });
  }

  const newBusiness = {
    id: `business${Date.now()}`, 
    name,
    address,
    phone,
    category,
    subcategories,
  };

  res.status(201).json(newBusiness); 
});

// List All Businesses
app.get('/businesses', (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const start = (page - 1) * limit;
  const end = page * limit;

  // Paginate the businesses
  const businessPage = businesses.slice(start, end);
  const totalBusinesses = businesses.length;
  const totalPages = Math.ceil(totalBusinesses / limit);

  res.json({
    currentPage: parseInt(page),
    totalPages: totalPages,
    totalBusinesses: totalBusinesses,
    businesses: businessPage,
  });
});

// Get Business Information
app.get('/businesses/:id', (req, res) => {
  const { id } = req.params;
  const business = businesses.find((b) => b.id === id);

  if (!business) {
    return res.status(404).send({ error: 'Business not found' });
  }
  res.json(business);
});

app.put('/businesses/:id', (req, res) => {
  const { id } = req.params;
  const { name, address, phone, category, subcategories } = req.body;

  if (!name || !address || !phone || !category || !subcategories) {
    return res.status(400).send({ error: 'Missing required fields' });
  }

  const index = businesses.findIndex((b) => b.id === id);
  if (index === -1) {
    return res.status(404).send({ error: 'Business not found' });
  }

  // Update the business data
  const updatedBusiness = {
    id,
    name,
    address,
    phone,
    category,
    subcategories,
  };

  businesses[index] = updatedBusiness; // Replace the business with updated data

  res.json(updatedBusiness);
});

// Write a Review
app.post('/businesses/:id/reviews', (req, res) => {
  const businessId = req.params.id;
  const { userId, stars, dollars, review } = req.body;

  if (
    typeof userId !== 'string' ||
    typeof stars !== 'number' ||
    typeof dollars !== 'number' ||
    stars < 0 || stars > 5 ||
    dollars < 1 || dollars > 4
  ) {
    return res.status(400).json({ error: 'Missing or invalid fields' });
  }

  const newReview = {
    id: `review${Date.now()}`,
    businessId,
    userId,
    stars,
    dollars,
    review: review || '',
  };

  // Add review
  reviews.push(newReview);

  res.status(201).json(newReview);
});

// Edit a Review
app.put('/businesses/:businessId/reviews/:reviewId', (req, res) => {
  const { businessId, reviewId } = req.params;
  const { userId, stars, dollars, review } = req.body;

  if (
    typeof userId !== 'string' ||
    typeof stars !== 'number' ||
    typeof dollars !== 'number' ||
    stars < 0 || stars > 5 ||
    dollars < 1 || dollars > 4
  ) {
    return res.status(400).json({ error: 'Invalid fields' });
  }

  const updatedReview = {
    id: reviewId,
    businessId,
    userId,
    stars,
    dollars,
    review: review || '',
  };

  res.json(updatedReview); 
});
app.delete('/businesses/:id', (req, res) => {
  const { id } = req.params;
  
  // Find and remove the business
  const index = businesses.findIndex((b) => b.id === id);
  if (index === -1) {
    return res.status(404).send({ error: 'Business not found' });
  }

  businesses.splice(index, 1);

  res.status(204).send();
});

// Delete a Review
app.delete('/businesses/:businessId/reviews/:reviewId', (req, res) => {
  const { businessId, reviewId } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }
  const reviewIndex = reviews.findIndex(r => r.id === reviewId && r.businessId === businessId);

  // Remove the review
  reviews.splice(reviewIndex, 1);
  res.status(204).send();
});

// Get all reviews for a specific business
app.get('/businesses/:businessId/reviews', (req, res) => {
  const { businessId } = req.params;

  const businessReviews = reviews.filter(
    (r) => r.businessId === businessId
  );

  res.json(businessReviews);
});

// Get all reviews for a specific user
app.get('/users/:userId/reviews', (req, res) => {
  const userId = req.params.userId;

  const userReviews = reviews.filter((r) => r.userId === userId);
  res.json(userReviews);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});