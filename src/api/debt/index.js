import {Router} from 'express'
import {middleware as query} from 'querymen'
import {middleware as body} from 'bodymen'
import {token} from '../../services/passport'
import {create, index, show, update, destroy, showDeals} from './controller'
import {schema} from './model'

export Debt, {schema} from './model'

const router = new Router()
const {soul, date, rate, debt} = schema.tree

/**
 * @api {post} /debts Create debt
 * @apiName CreateDebt
 * @apiGroup Debt
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam {User} soul Должник
 * @apiParam {Date} date Дата последней сделки
 * @apiParam {Number} rate Ставка
 * @apiParam {Number} debt Долг
 * @apiSuccess {Object} debt Debt's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Debt not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({required: true}),
  body({soul, date, rate, debt}),
  create)

/**
 * @api {get} /debts Retrieve debts
 * @apiName RetrieveDebts
 * @apiGroup Debt
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Object[]} debts List of debts.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get('/',
  token({required: true}),
  query(),
  index)

/**
 * @api {get} /debts/:id Retrieve debt
 * @apiName RetrieveDebt
 * @apiGroup Debt
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} debt Debt's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Debt not found.
 * @apiError 401 user access only.
 */
router.get('/:id',
  token({required: true}),
  show)

/**
 * @api {get} /debts/:id/deals История долга
 * @apiName RetrieveDealsOfDebt
 * @apiGroup Debt
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} debt Debt's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Debt not found.
 * @apiError 401 user access only.
 */
router.get('/:id/deals',
  token({required: true}),
  showDeals)

/**
 * @api {put} /debts/:id Update debt
 * @apiName UpdateDebt
 * @apiGroup Debt
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam {User} soul Должник
 * @apiParam {Date} date Дата последней сделки
 * @apiParam {Number} rate Ставка
 * @apiParam {Number} debt Долг
 * @apiSuccess {Object} debt Debt's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Debt not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({required: true}),
  body({soul, date, rate, debt}),
  update)

/**
 * @api {delete} /debts/:id Delete debt
 * @apiName DeleteDebt
 * @apiGroup Debt
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Debt not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({required: true}),
  destroy)

export default router
