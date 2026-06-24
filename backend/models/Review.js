import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reviewee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    swapRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'SwapRequest' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, maxlength: 100, default: '' },
    comment: { type: String, maxlength: 1000, default: '' },
    isApproved: { type: Boolean, default: true },
    isFlagged: { type: Boolean, default: false },
  },
  { timestamps: true }
);

reviewSchema.index({ reviewee: 1, reviewer: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
