import 'babel-polyfill'
import jwt from 'jsonwebtoken'
import { sessionSecret } from './config'

function verifyToken(req, res, next) {
  const token = req.headers['x-access-token']
  if (!token) return res.status(403).json({auth: false, message: 'No token provided'})
  jwt.verify(token, sessionSecret, (err, decoded) => {
    if (err) return res.status(500).json({auth: false, message: 'Failed to authenticate token'})
    req.email = decoded.email
    next()
  })
}

export default verifyToken
