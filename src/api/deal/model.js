import mongoose, {Schema} from 'mongoose'

const dealSchema = new Schema({
  bank: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  soul: {
    type: Schema.ObjectId,
    ref: 'User',
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
      bank: this.bank.view(false),
      soul: this.soul,
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
