import mongoose, { Schema } from 'mongoose'

const debtSchema = new Schema({
  bank: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  soul: {
    type: String
  },
  date: {
    type: String
  },
  rate: {
    type: String
  },
  debt: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

debtSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      bank: this.bank.view(full),
      soul: this.soul,
      date: this.date,
      rate: this.rate,
      debt: this.debt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Debt', debtSchema)

export const schema = model.schema
export default model
