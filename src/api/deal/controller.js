import {success, notFound, authorOrAdmin} from '../../services/response/'
import {Deal} from '.'
import {Debt} from '../debt'

const setDebt = (entity) => {
  if (entity) {
    const {debt, type, deal, date} = entity

    Debt.findById(debt, function (err, res) {
      if (!err) {
        if (!res) {
          return false
        }
        res.debt = res.getDebt(date)
        if (type === '%') {
          res.rate = deal
        } else if (type === '-') {
          res.debt -= deal
        } else if (type === '+') {
          res.debt += deal
        } else if (type === '=') {
          res.debt = deal
        }
        res.date = date
        res.save()
      }
    })
    return entity
  }
}

export const create = ({user, bodymen: {body}}, res, next) =>
  Deal.create({...body})
    .then(authorOrAdmin(res, user, 'debt.bank'))
    .then((deal) => deal.view(true))
    .then(setDebt)
    .then(success(res, 201))
    .catch(next)

export const index = ({querymen: {query, select, cursor}}, res, next) =>
  Deal.find(query, select, cursor)
    .then((deals) => deals.map((deal) => deal.view()))
    .then(success(res))
    .catch(next)

export const show = ({params}, res, next) =>
  Deal.findById(params.id)
    .then(notFound(res))
    .then((deal) => deal ? deal.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({user, bodymen: {body}, params}, res, next) =>
  Deal.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'debt.bank'))
    .then((deal) => deal ? Object.assign(deal, body).save() : null)
    .then((deal) => deal ? deal.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({user, params}, res, next) =>
  Deal.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'debt.bank'))
    .then((deal) => deal ? deal.remove() : null)
    .then(success(res, 204))
    .catch(next)
