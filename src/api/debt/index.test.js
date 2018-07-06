import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Debt } from '.'

const app = () => express(apiRoot, routes)

let userSession, anotherSession, debt

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  debt = await Debt.create({ bank: user })
})

test('POST /debts 201 (user)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession, soul: 'test', date: 'test', rate: 'test', debt: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.soul).toEqual('test')
  expect(body.date).toEqual('test')
  expect(body.rate).toEqual('test')
  expect(body.debt).toEqual('test')
  expect(typeof body.bank).toEqual('object')
})

test('POST /debts 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /debts 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
  expect(typeof body[0].bank).toEqual('object')
})

test('GET /debts 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /debts/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${debt.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(debt.id)
  expect(typeof body.bank).toEqual('object')
})

test('GET /debts/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${debt.id}`)
  expect(status).toBe(401)
})

test('GET /debts/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})

test('PUT /debts/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${debt.id}`)
    .send({ access_token: userSession, soul: 'test', date: 'test', rate: 'test', debt: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(debt.id)
  expect(body.soul).toEqual('test')
  expect(body.date).toEqual('test')
  expect(body.rate).toEqual('test')
  expect(body.debt).toEqual('test')
  expect(typeof body.bank).toEqual('object')
})

test('PUT /debts/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${debt.id}`)
    .send({ access_token: anotherSession, soul: 'test', date: 'test', rate: 'test', debt: 'test' })
  expect(status).toBe(401)
})

test('PUT /debts/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${debt.id}`)
  expect(status).toBe(401)
})

test('PUT /debts/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: anotherSession, soul: 'test', date: 'test', rate: 'test', debt: 'test' })
  expect(status).toBe(404)
})

test('DELETE /debts/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${debt.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /debts/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${debt.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /debts/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${debt.id}`)
  expect(status).toBe(401)
})

test('DELETE /debts/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
