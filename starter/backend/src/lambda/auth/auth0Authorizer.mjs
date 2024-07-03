import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const jwksUrl = 'https://test.auth0.com/.well-known/jwks.json'

export async function handler(event) {
  try {
    logger.info('Event token : ' + event.authorizationToken)
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })

  const response = await Axios.get(jwksUrl)
  const keyset = response.data.keys.find((key) => key.kid === jwt.header.kid)

  logger.info('keyset', keyset)
  if (!keyset) {
    throw new Error('Keys is invalid')
  }
  const certificate = `-----BEGIN CERTIFICATE-----\n${keyset.x5c[0]}\n-----END CERTIFICATE-----\n`
  const verifyresult = jsonwebtoken.verify(token, certificate, {
    algorithms: ['RS256']
  })
  logger.info('verifyresult', verifyresult)
  return verifyresult
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
