import mongoose, { Document, Schema } from 'mongoose';

export interface IMedia {
  type: 'image' | 'video';
  url: string;
}

export interface IPost extends Document {
  content: string;
  media: IMedia[];
  author: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  comments: mongoose.Types.ObjectId[];
  likes: mongoose.Types.ObjectId[];
  tags: string[];
}

const postSchema = new Schema<IPost>(
  {
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
    },
    media: [
      {
        type: {
          type: String,
          enum: ['image', 'video'],
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    tags: [String],
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ tags: 1 });

export const Post = mongoose.model<IPost>('Post', postSchema); 