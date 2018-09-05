import mongoose, {Schema} from 'mongoose'

const dealSchema = new Schema({
  debt: {
    type: Schema.ObjectId,
    ref: 'Debt',
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  },
  type: {
    type: String,
    default: '='
  },
  deal: {
    type: Number,
    default: '0'
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => {
      delete ret._id
    }
  }
})

dealSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      debt: this.debt,
      date: this.date,
      type: this.type,
      deal: this.deal
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Deal', dealSchema)

export const schema = model.schema
export default model
