import mongoose, { Schema, Model } from 'mongoose';

export interface IMCUItem {
  _id: mongoose.Types.ObjectId;
  itemId: string; // ID do filme/série (ex: 'iron-man')
  trailerUrl?: string;
  trailerUrlDublado?: string;
  trailerUrlLegendado?: string;
  // Campos adicionais que podem ser editados pelo admin
  customDescription?: string;
  customSynopsis?: string;
  customImageUrl?: string;
  customBackdropUrl?: string;
  updatedAt: Date;
  updatedBy?: string; // Email do admin que fez a última alteração
}

const MCUItemSchema = new Schema<IMCUItem>(
  {
    itemId: {
      type: String,
      required: [true, 'ID do item é obrigatório'],
      unique: true,
      trim: true,
    },
    trailerUrl: {
      type: String,
      trim: true,
    },
    trailerUrlDublado: {
      type: String,
      trim: true,
    },
    trailerUrlLegendado: {
      type: String,
      trim: true,
    },
    customDescription: {
      type: String,
      trim: true,
    },
    customSynopsis: {
      type: String,
      trim: true,
    },
    customImageUrl: {
      type: String,
      trim: true,
    },
    customBackdropUrl: {
      type: String,
      trim: true,
    },
    updatedBy: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation
const MCUItem: Model<IMCUItem> = mongoose.models.MCUItem || mongoose.model<IMCUItem>('MCUItem', MCUItemSchema);

export default MCUItem;
