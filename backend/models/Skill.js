import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Skill name is required'], trim: true, unique: true },
    slug: { type: String, unique: true, lowercase: true },
    category: {
      type: String,
      required: true,
      enum: [
        'Technology',
        'Design',
        'Business',
        'Languages',
        'Music',
        'Fitness',
        'Cooking',
        'Arts',
        'Education',
        'Other',
      ],
    },
    description: { type: String, maxlength: 500, default: '' },
    icon: { type: String, default: '💡' },
    image: {
      public_id: String,
      url: String,
    },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    userCount: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

skillSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

skillSchema.index({ name: 'text', description: 'text', category: 'text' });

const Skill = mongoose.model('Skill', skillSchema);
export default Skill;
