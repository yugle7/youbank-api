import {Router} from 'express'
import {middleware as query} from 'querymen'
import {middleware as body} from 'bodymen'
import {token} from '../../services/passport'
import {create, index, show, update, destroy} from './controller'
import {schema} from './model'

export Deal, {schema} from './model'

const router = new Router()
const {soul, date, type, deal} = schema.tree

/**
 * @api {post} /deals Create deal
 * @apiName CreateDeal
 * @apiGroup Deal
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam {User} soul Должник
 * @apiParam {Date} date Дата
 * @apiParam {String} type Тип
 * @apiParam {Number} deal Размер
 * @apiSuccess {Object} deal Deal's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Deal not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({required: true}),
  body({soul, date, type, deal}),
  create)

/**
 * @api {get} /deals Retrieve deals
 * @apiName RetrieveDeals
 * @apiGroup Deal
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Object[]} deals List of deals.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get('/',
  token({required: true}),
  query(),
  index)

/**
 * @api {get} /deals/:id Retrieve deal
 * @apiName RetrieveDeal
 * @apiGroup Deal
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} deal Deal's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Deal not found.
 * @apiError 401 user access only.
 */
router.get('/:id',
  token({required: true}),
  show)

/**
 * @api {put} /deals/:id Update deal
 * @apiName UpdateDeal
 * @apiGroup Deal
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam {User} soul Должник
 * @apiParam {Date} date Дата
 * @apiParam {String} type Тип
 * @apiParam {Number} deal Размер
 * @apiSuccess {Object} deal Deal's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Deal not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({required: true}),
  body({soul, date, type, deal}),
  update)

/**
 * @api {delete} /deals/:id Delete deal
 * @apiName DeleteDeal
 * @apiGroup Deal
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Deal not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({required: true}),
  destroy)

export default router
