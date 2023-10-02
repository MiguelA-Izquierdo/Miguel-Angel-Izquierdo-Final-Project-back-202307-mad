import { Schema, model } from 'mongoose';
import { Travel } from '../entities/travel';

const travelSchema = new Schema<Travel>({
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },

  totalDays: {
    type: Number,
    required: true,
  },

  travellers: {
    type: Number,
    default: 1,
  },

  budget: {
    type: Number,
  },

  mainPhoto: {
    type: {
      publicId: { type: String },
      width: { type: Number },
      height: { type: Number },
      format: { type: String },
      url: { type: String },
      urlCard: { type: String },
    },
  },

  traveler: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  days: {
    type: [
      {
        dayNumber: Number,
        activities: [
          {
            title: { type: String },
            description: { type: String },
            assessment: [{ position: Number, state: Boolean }],
            photos: [
              {
                publicId: { type: String },
                width: { type: Number },
                height: { type: Number },
                format: { type: String },
                url: { type: String },
                urlCard: { type: String },
              },
            ],
          },
        ],
      },
    ],
  },
});

travelSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});

export const TravelModel = model('Travel', travelSchema, 'Trips');
