import mongoose, { Schema, Model } from 'mongoose';

export interface IUserPreferences {
  hideWhatsNew: boolean;
  hideOnboarding: boolean;
  hideSpoilerWarning: boolean;
  lastSeenVersion: string;
}

export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  watchedItems: string[];
  isAdmin: boolean;
  preferences: IUserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Por favor, insira seu nome'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Por favor, insira seu email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Por favor, insira sua senha'],
      minlength: [6, 'A senha deve ter no mínimo 6 caracteres'],
    },
    watchedItems: {
      type: [String],
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    preferences: {
      type: {
        hideWhatsNew: { type: Boolean, default: false },
        hideOnboarding: { type: Boolean, default: false },
        hideSpoilerWarning: { type: Boolean, default: false },
        lastSeenVersion: { type: String, default: '0.0.0' },
      },
      default: {
        hideWhatsNew: false,
        hideOnboarding: false,
        hideSpoilerWarning: false,
        lastSeenVersion: '0.0.0',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
