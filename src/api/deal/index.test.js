import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Deal } from '.'

const app = () => express(apiRoot, routes)

let userSession, anotherSession, deal

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  deal = await Deal.create({ bank: user })
})

test('POST /deals 201 (user)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession, soul: 'test', date: 'test', type: 'test', deal: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.soul).toEqual('test')
  expect(body.date).toEqual('test')
  expect(body.type).toEqual('test')
  expect(body.deal).toEqual('test')
  expect(typeof body.bank).toEqual('object')
})

test('POST /deals 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /deals 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
  expect(typeof body[0].bank).toEqual('object')
})

test('GET /deals 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /deals/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${deal.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(deal.id)
  expect(typeof body.bank).toEqual('object')
})

test('GET /deals/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${deal.id}`)
  expect(status).toBe(401)
})

test('GET /deals/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})

test('PUT /deals/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${deal.id}`)
    .send({ access_token: userSession, soul: 'test', date: 'test', type: 'test', deal: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(deal.id)
  expect(body.soul).toEqual('test')
  expect(body.date).toEqual('test')
  expect(body.type).toEqual('test')
  expect(body.deal).toEqual('test')
  expect(typeof body.bank).toEqual('object')
})

test('PUT /deals/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${deal.id}`)
    .send({ access_token: anotherSession, soul: 'test', date: 'test', type: 'test', deal: 'test' })
  expect(status).toBe(401)
})

test('PUT /deals/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${deal.id}`)
  expect(status).toBe(401)
})

test('PUT /deals/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: anotherSession, soul: 'test', date: 'test', type: 'test', deal: 'test' })
  expect(status).toBe(404)
})

test('DELETE /deals/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${deal.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /deals/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${deal.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /deals/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${deal.id}`)
  expect(status).toBe(401)
})

test('DELETE /deals/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
