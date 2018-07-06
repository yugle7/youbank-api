import { Debt } from '.'
import { User } from '../user'

let user, debt

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  debt = await Debt.create({ bank: user, soul: 'test', date: 'test', rate: 'test', debt: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = debt.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(debt.id)
    expect(typeof view.bank).toBe('object')
    expect(view.bank.id).toBe(user.id)
    expect(view.soul).toBe(debt.soul)
    expect(view.date).toBe(debt.date)
    expect(view.rate).toBe(debt.rate)
    expect(view.debt).toBe(debt.debt)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = debt.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(debt.id)
    expect(typeof view.bank).toBe('object')
    expect(view.bank.id).toBe(user.id)
    expect(view.soul).toBe(debt.soul)
    expect(view.date).toBe(debt.date)
    expect(view.rate).toBe(debt.rate)
    expect(view.debt).toBe(debt.debt)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
