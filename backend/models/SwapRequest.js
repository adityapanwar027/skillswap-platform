import mongoose from 'mongoose';

const swapRequestSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    offeredSkill: {
      name: String,
      level: String,
      description: String,
    },
    requestedSkill: {
      name: String,
      level: String,
      description: String,
    },
    message: { type: String, maxlength: 500, default: '' },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'cancelled', 'completed'],
      default: 'pending',
    },
    respondedAt: Date,
    completedAt: Date,
  },
  { timestamps: true }
);

swapRequestSchema.index({ sender: 1, receiver: 1, status: 1 });

const SwapRequest = mongoose.model('SwapRequest', swapRequestSchema);
export default SwapRequest;
