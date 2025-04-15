import mongoose, { Document, Schema } from 'mongoose';

export interface IVoiceRoom extends Document {
  title: string;
  description?: string;
  host: mongoose.Types.ObjectId;
  isLive: boolean;
  participants: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const voiceRoomSchema = new Schema<IVoiceRoom>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    host: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isLive: {
      type: Boolean,
      default: false,
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
voiceRoomSchema.index({ host: 1, isLive: 1 });
voiceRoomSchema.index({ isLive: 1, createdAt: -1 });

export const VoiceRoom = mongoose.model<IVoiceRoom>('VoiceRoom', voiceRoomSchema); 