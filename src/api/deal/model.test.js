import {Deal} from '.'
import {User} from '../user'

let user, deal

beforeEach(async () => {
  user = await User.create({email: 'a@a.com', password: '123456'})
  deal = await Deal.create({bank: user, soul: user, date: Date.now(), type: '=', deal: 100000})
})

describe('view', () => {
  it('returns simple view', () => {
    const view = deal.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(deal.id)
    expect(typeof view.bank).toBe('object')
    expect(view.bank.id).toBe(user.id)
    expect(typeof view.soul).toBe('object')
    expect(view.soul).toBe(user.id)
    expect(view.date).toBe(deal.date)
    expect(view.type).toBe(deal.type)
    expect(view.deal).toBe(deal.deal)
  })

  it('returns full view', () => {
    const view = deal.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(deal.id)
    expect(typeof view.bank).toBe('object')
    expect(view.bank.id).toBe(user.id)
    expect(typeof view.soul).toBe('object')
    expect(view.soul).toBe(user.id)
    expect(view.date).toBe(deal.date)
    expect(view.type).toBe(deal.type)
    expect(view.deal).toBe(deal.deal)
  })
})
