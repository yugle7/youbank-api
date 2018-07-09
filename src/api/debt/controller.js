import {success, notFound, authorOrAdmin} from '../../services/response/'
import {Debt} from '.'
import {Deal} from '../deal'

export const create = ({user, bodymen: {body}}, res, next) =>
  Debt.create({...body, bank: user})
    .then((debt) => debt.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({querymen: {query, select, cursor}}, res, next) =>
  Debt.find(query, select, cursor)
    .populate('bank')
    .then((debts) => debts.map((debt) => debt.view(true)))
    .then(success(res))
    .catch(next)

export const show = ({params}, res, next) =>
  Debt.findById(params.id)
    .populate('bank')
    .then(notFound(res))
    .then((debt) => debt ? debt.view(true) : null)
    .then(success(res))
    .catch(next)

export const showDeals = ({params}, res, next) =>
  Debt.findById(params.id)
    // .populate('bank')
    .then(notFound(res))
    .then((debt) => debt ? Deal.find({bank: debt.bank, soul: debt.soul}) : null)
    .then((deals) => deals ? deals.map((deal) => deal.view()) : null)
    .then(success(res))
    .catch(next)

export const update = ({user, bodymen: {body}, params}, res, next) =>
  Debt.findById(params.id)
    .populate('bank')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'bank'))
    .then((debt) => debt ? Object.assign(debt, body).save() : null)
    .then((debt) => debt ? debt.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({user, params}, res, next) =>
  Debt.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'bank'))
    .then((debt) => debt ? debt.remove() : null)
    .then(success(res, 204))
    .catch(next)
