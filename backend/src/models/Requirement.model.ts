import { Schema, model, Document } from 'mongoose';

export interface IRequirement extends Document {
  eventName: string;
  eventType: string;
  startDate: Date;
  endDate: Date;
  location: string;
  venue?: string;
  category: 'planner' | 'performer' | 'crew';
  details: Record<string, unknown>;
  status: 'submitted' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const requirementSchema = new Schema<IRequirement>(
  {
    eventName: { type: String, required: true, trim: true },
    eventType: { type: String, required: true, trim: true },
    startDate: { type: Date,   required: true },
    endDate:   { type: Date,   required: true },
    location:  { type: String, required: true, trim: true },
    venue:     { type: String, trim: true },
    category:  {
      type:     String,
      required: true,
      enum:     ['planner', 'performer', 'crew'],
    },
    // details structure is enforced by Zod in the controller before any document is created.
    // Using Mixed here avoids duplicating the discriminated-union logic as Mongoose sub-schemas.
    details: { type: Schema.Types.Mixed, required: true },
    status:  {
      type:    String,
      enum:    ['submitted', 'archived'],
      default: 'submitted',
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

export const Requirement = model<IRequirement>('Requirement', requirementSchema);
