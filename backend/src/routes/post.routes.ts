import { Router } from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  deleteComment,
} from '../controllers/post.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'),
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed!'));
    }
  },
});

// Validation middleware
const validatePost = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ max: 1000 })
    .withMessage('Content must be less than 1000 characters'),
  body('tags')
    .optional()
    .isString()
    .withMessage('Tags must be a string'),
];

const validateComment = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Comment content is required')
    .isLength({ max: 500 })
    .withMessage('Comment must be less than 500 characters'),
];

// Routes
router
  .route('/')
  .get(getPosts)
  .post(protect, upload.array('media', 5), validatePost, createPost);

router
  .route('/:id')
  .get(getPost)
  .patch(protect, validatePost, updatePost)
  .delete(protect, deletePost);

router
  .route('/:id/like')
  .post(protect, likePost)
  .delete(protect, unlikePost);

router
  .route('/:id/comments')
  .post(protect, validateComment, addComment);

router
  .route('/:id/comments/:commentId')
  .delete(protect, deleteComment);

export default router; 