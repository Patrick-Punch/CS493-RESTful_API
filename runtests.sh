#!/bin/sh

status() {
    printf "\n=====================================================\n"
    printf "%s\n" "$1"
    printf -- "-----------------------------------------------------\n"
}

# GET All Businesses
status "GET /businesses - should return paginated list of businesses"
curl -s "http://localhost:3000/businesses"

# GET Business by ID
status "GET /businesses/1 - should return business"
curl -s "http://localhost:3000/businesses/1"

# Fail to GET Business by ID
status "GET /businesses/9999 - should return 404"
curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/businesses/9999"

# POST a New Business
status "POST /businesses - should create new business"
curl -s -X POST "http://localhost:3000/businesses" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "New Biz",
      "address": { "street": "1 Main St", "city": "Bend", "state": "OR", "zip": "97701" },
      "phone": "123-456-7890",
      "category": "Cafe",
      "subcategories": ["Coffee", "Bakery"]
    }'

# Fail to POST a New Business
status "POST /businesses - should fail with missing fields"
curl -s -X POST "http://localhost:3000/businesses" \
    -H "Content-Type: application/json" \
    -d '{"name": "Fail Biz"}'

# Update a Business
status "PUT /businesses/1 - should update business"
curl -s -X PUT "http://localhost:3000/businesses/1" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Updated Biz",
      "address": { "street": "2 Main St", "city": "Bend", "state": "OR", "zip": "97702" },
      "phone": "987-654-3210",
      "category": "Restaurant",
      "subcategories": ["Updated"]
    }'

# Fail to Update a Business
status "PUT /businesses/1 - should fail with missing fields"
curl -s -X PUT "http://localhost:3000/businesses/1" \
    -H "Content-Type: application/json" \
    -d '{"name": "Oops"}'

# DELETE a Business
status "DELETE /businesses/2 - should return 204"
curl -s -X DELETE -o /dev/null -w "%{http_code}" "http://localhost:3000/businesses/2"

# Fail to DELETE a Business
status "DELETE /businesses/9999 - should return 404"
curl -s -X DELETE -o /dev/null -w "%{http_code}" "http://localhost:3000/businesses/9999"

# POST a Review
status "POST /businesses/1/reviews - should create review"
curl -s -X POST "http://localhost:3000/businesses/1/reviews" \
    -H "Content-Type: application/json" \
    -d '{
      "userId": "testuser1",
      "stars": 5,
      "dollars": 3,
      "review": "Fantastic!"
    }'

# Fail to POST a Review
status "POST /businesses/1/reviews - should fail with invalid data"
curl -s -X POST "http://localhost:3000/businesses/1/reviews" \
    -H "Content-Type: application/json" \
    -d '{
      "userId": 123,
      "stars": "a lot",
      "dollars": "many"
    }'


# Update a Review
status "PUT /businesses/1/reviews/review123 - should update review"
curl -s -X PUT "http://localhost:3000/businesses/1/reviews/review123" \
    -H "Content-Type: application/json" \
    -d '{
      "userId": "testuser1",
      "stars": 4,
      "dollars": 2,
      "review": "Updated review text"
    }'

# Fail to Update a Review
status "PUT /businesses/1/reviews/review123 - should fail with missing fields"
curl -s -X PUT "http://localhost:3000/businesses/1/reviews/review123" \
    -H "Content-Type: application/json" \
    -d '{"userId": "testuser1"}'

# -----------------------------------------------------
# DELETE a Review
status "DELETE /businesses/1/reviews/review123 - should return 204"
curl -s -X DELETE "http://localhost:3000/businesses/1/reviews/review123" \
    -H "Content-Type: application/json" \
    -d '{"userId": "testuser1"}' \
    -w "%{http_code}"

# Fail to DELETE a Review
status "DELETE /businesses/1/reviews/review123 - should fail with missing userId"
curl -s -X DELETE "http://localhost:3000/businesses/1/reviews/review123" \
    -H "Content-Type: application/json" \
    -d '{}'

# GET all reviews for a business
status "GET /businesses/1/reviews - should return list"
curl -s "http://localhost:3000/businesses/1/reviews"

# GET reviews by userId
status "GET /users/user1/reviews - should return user reviews"
curl -s "http://localhost:3000/users/user1/reviews"