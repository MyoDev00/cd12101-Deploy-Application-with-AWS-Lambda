import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const jwksUrl = 'https://test-endpoint.auth0.com/.well-known/jwks.json'
const certificate = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJanYikJOh5DqEMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi1maWtwczB5b2owOHF5OGVnLnVzLmF1dGgwLmNvbTAeFw0yNDA2MTgx
MzQ4NThaFw0zODAyMjUxMzQ4NThaMCwxKjAoBgNVBAMTIWRldi1maWtwczB5b2ow
OHF5OGVnLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBANk9n88pVGRG4siwkV0eUMC09d7D0otAil4GuVDeWP2+ipCPi84B6q3nDxjw
dDOdLtyvjEi40nCMYBUeeRnAxRLoTuAHVQ//EpwiH1LCj4wHRYPKVln0OM5LCzwY
c//sMX0x8im5Rf2ycqT2JDI4O4bt+0Z5QQgEjNOzNSOeu3G2rYmtN4CffNDL/NHl
6ilPAND7WZthcR01SIhlzmYrIcyouV1nBpnBrudakrm1DoyOKm5zEd1bzpmvTtrW
04/dAEhk6/HXBBOiDSZyn4HEyjDtEP9z/DxyqWxPUHUWgVmEW32TmtG53ItUrAN+
tUs+bhc3HkApolWHxh1EF6FYJeUCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQU7WMX0ZMC4ulIbxf7dvhOrZJ5w5IwDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQBeX2EADpM4z/WIAeJMYN7WQkiQ7MtqQ10n2LhHlDlj
ut506AI9oZE6e/PrZbtdBZrXZ594VQhpPzwHdddTUKmZQUvXJJi+Dvix2+oRYUIH
YN9CKswuhuSf08MKfasYWUwIV9QH78gtYh35wG2miCExyxhZE/yLL66OKCyeqdDi
tOgSCC2OZcsgGVJtQcESnrYbKNrFJ6XcTbwO1Z/Qg+nH8bOOtFf64CoimHJgJflS
JjKYNacDBefg60LsCtS1U32Q3FY0lJ3LPQSkMI/mwt8yiQjdcS2Hz57ynG3Um399
VqtruJ78Ys+3o2HKS0IwSfZpTgfdopBMG9vZoegfOsNj
-----END CERTIFICATE-----`

export async function handler(event) {
  try {
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
  return jsonwebtoken.verify(token, certificate, { algorithms: ['HS256'] })
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
