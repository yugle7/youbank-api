import {success, notFound, authorOrAdmin} from '../../services/response/'
import {Deal} from '.'
import {Debt} from '../debt'

// const setDate = () => (entity) => {
//   if (entity) {
//     if (entity.date === null) {
//       entity.date = new Date()
//       entity.save()
//       return entity
//     }
//     return entity
//   }
//   return null
// }
//
const setDebt = () => (entity) => {
  if (entity) {
    const {bank, soul, type, deal, date} = entity

    let debt = Debt.find({bank: bank, soul: soul})
    if (!debt) {
      debt = Debt.create({
        bank: bank,
        soul: soul,
        debt: 0,
        rate: 0,
        date: date
      })
    }

    debt.debt = debt.get(date)
    if (type === '%') {
      debt.rate = deal
    } else if (type === '-') {
      debt.debt -= deal
    } else if (type === '+') {
      debt.debt += deal
    } else if (type === '=') {
      debt.debt = deal
    }
    debt.date = date
    debt.save()
    return entity
  }
  return null
}

export const create = ({user, bodymen: {body}}, res, next) =>
  Deal.create({...body, bank: user})
    .then((deal) => deal.view(true))
    // .then(setDate())
    .then(setDebt())
    .then(success(res, 201))
    .catch(next)

export const index = ({querymen: {query, select, cursor}}, res, next) =>
  Deal.find(query, select, cursor)
    .populate('bank')
    .then((deals) => deals.map((deal) => deal.view()))
    .then(success(res))
    .catch(next)

export const show = ({params}, res, next) =>
  Deal.findById(params.id)
    .populate('bank')
    .then(notFound(res))
    .then((deal) => deal ? deal.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({user, bodymen: {body}, params}, res, next) =>
  Deal.findById(params.id)
    .populate('bank')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'bank'))
    .then((deal) => deal ? Object.assign(deal, body).save() : null)
    .then((deal) => deal ? deal.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({user, params}, res, next) =>
  Deal.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'bank'))
    .then((deal) => deal ? deal.remove() : null)
    .then(success(res, 204))
    .catch(next)
