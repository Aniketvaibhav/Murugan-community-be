import { Request, Response } from 'express';
import { Post } from '../models/Post';
import { User } from '../models/User';
import { Comment } from '../models/Comment';
import mongoose from 'mongoose';

// Define the MulterRequest interface with the correct typing for array upload
interface MulterRequest extends Request {
  files: Express.Multer.File[];
}

// Create a new post
export const createPost = async (req: Request, res: Response) => {
  try {
    const { content, tags } = req.body;
    const media = req.files 
      ? (req.files as Express.Multer.File[]).map(file => ({
          type: file.mimetype.startsWith('image') ? 'image' : 'video',
          url: file.path,
        }))
      : [];

    const post = await Post.create({
      content,
      media,
      author: req.user._id,
      tags: tags ? tags.split(',').map((tag: string) => tag.trim()) : [],
    });

    res.status(201).json({
      status: 'success',
      data: {
        post,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Get all posts with pagination
export const getPosts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name username avatar')
      .populate('comments')
      .populate('likes', 'name username avatar');

    const total = await Post.countDocuments();

    res.status(200).json({
      status: 'success',
      data: {
        posts,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Get a single post
export const getPost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name username avatar')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name username avatar',
        },
      })
      .populate('likes', 'name username avatar');

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        post,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Update a post
export const updatePost = async (req: Request, res: Response) => {
  try {
    const { content, tags } = req.body;
    const post = await Post.findOne({
      _id: req.params.id,
      author: req.user._id,
    });

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found or you are not authorized to update it',
      });
    }

    post.content = content || post.content;
    post.tags = tags ? tags.split(',').map((tag: string) => tag.trim()) : post.tags;
    await post.save();

    res.status(200).json({
      status: 'success',
      data: {
        post,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Delete a post
export const deletePost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      author: req.user._id,
    });

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found or you are not authorized to delete it',
      });
    }

    // Delete all comments associated with the post
    await Comment.deleteMany({ post: post._id });

    // Delete the post
    await post.deleteOne();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Like a post
export const likePost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found',
      });
    }

    // Check if user already liked the post
    if (post.likes.includes(req.user._id)) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already liked this post',
      });
    }

    post.likes.push(req.user._id);
    await post.save();

    res.status(200).json({
      status: 'success',
      data: {
        post,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Unlike a post
export const unlikePost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found',
      });
    }

    // Check if user has liked the post
    if (!post.likes.includes(req.user._id)) {
      return res.status(400).json({
        status: 'error',
        message: 'You have not liked this post',
      });
    }

    post.likes = post.likes.filter(
      (like) => like.toString() !== req.user._id.toString()
    );
    await post.save();

    res.status(200).json({
      status: 'success',
      data: {
        post,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Add a comment to a post
export const addComment = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found',
      });
    }

    const comment = await Comment.create({
      content,
      author: req.user._id,
      post: post._id,
    });

    post.comments.push(comment._id);
    await post.save();

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name username avatar');

    res.status(201).json({
      status: 'success',
      data: {
        comment: populatedComment,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Delete a comment
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const comment = await Comment.findOne({
      _id: req.params.commentId,
      author: req.user._id,
    });

    if (!comment) {
      return res.status(404).json({
        status: 'error',
        message: 'Comment not found or you are not authorized to delete it',
      });
    }

    // Remove comment from post's comments array
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: comment._id },
    });

    // Delete the comment
    await comment.deleteOne();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
}; 