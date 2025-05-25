const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  reviewText: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Update book average rating when a review is saved
reviewSchema.post('save', async function() {
  const Book = mongoose.model('Book');
  const book = await Book.findById(this.book);
  
  const reviews = await this.model('Review').find({ book: this.book });
  const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
  book.averageRating = totalRatings / reviews.length;
  
  await book.save();
});

module.exports = mongoose.model('Review', reviewSchema);
