import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { User } from '../models/User';

// Extend Express's Request interface globally
declare global {
  namespace Express {
    // Extend the existing Request interface
    interface Request {
      user?: any; // Keep the existing any type to avoid conflicts
    }
  }
}

export class UserController {
  static async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({ 
        data: { 
          user: {
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            bio: user.bio,
            location: user.location,
            avatar: user.avatar,
            coverImage: user.coverImage,
            createdAt: user.createdAt
          }
        } 
      });
    } catch (error) {
      console.error('Error getting user profile:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { name, username, bio, location } = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

      // Handle file uploads
      let avatarUrl: string | undefined;
      let coverImageUrl: string | undefined;

      if (files) {
        if (files.avatar?.[0]) {
          const avatarFile = files.avatar[0];
          const avatarFileName = `${userId}-${Date.now()}-avatar${path.extname(avatarFile.originalname)}`;
          const avatarPath = path.join('uploads', avatarFileName);
          fs.renameSync(avatarFile.path, avatarPath);
          avatarUrl = `/uploads/${avatarFileName}`;
        }

        if (files.coverImage?.[0]) {
          const coverFile = files.coverImage[0];
          const coverFileName = `${userId}-${Date.now()}-cover${path.extname(coverFile.originalname)}`;
          const coverPath = path.join('uploads', coverFileName);
          fs.renameSync(coverFile.path, coverPath);
          coverImageUrl = `/uploads/${coverFileName}`;
        }
      }

      // Update user in database
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          name,
          username,
          bio,
          location,
          ...(avatarUrl && { avatar: avatarUrl }),
          ...(coverImageUrl && { coverImage: coverImageUrl })
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({ data: { user: updatedUser } });
    } catch (error) {
      console.error('Error updating user profile:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
} 