import mongoose, {Schema} from 'mongoose'

const debtSchema = new Schema({
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
  rate: {
    type: Number,
    default: 0
  },
  debt: {
    type: Number,
    default: 0
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

debtSchema.methods = {
  getDebt (date) {
    if (this.rate && date && this.debt) {
      const t = (date - this.date) / 86400000
      const k = 365 / 12
      const m = Math.floor(t / k)
      const d = t - k * m

      return this.debt * (1 + this.rate * d / k) * Math.pow(1 + this.rate, m)
    }
    return this.debt
  },
  view (full) {
    const view = {
      // simple view
      id: this.id,
      bank: this.bank.view(false),
      soul: this.soul,
      date: this.date,
      rate: this.rate,
      debt: this.debt
    }
    return full ? {
      ...view,
      now: this.getDebt(new Date())
    } : view
  }
}

const model = mongoose.model('Debt', debtSchema)

export const schema = model.schema
export default model
