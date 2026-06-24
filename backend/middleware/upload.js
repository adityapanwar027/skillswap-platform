import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';
import { AppError } from './errorHandler.js';

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'skillswap/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
  },
});

export const uploadAvatar = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new AppError('Only image files are allowed', 400), false);
  },
}).single('avatar');

const skillImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'skillswap/skills',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

export const uploadSkillImage = multer({
  storage: skillImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single('image');
