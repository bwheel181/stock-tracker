import mongoose from 'mongoose'
import { StockSchema } from './stock'
import bcrypt from 'bcrypt'
const Schema = mongoose.Schema
const SALT_WORK_FACTOR = 10

const UserSchema = new Schema({
  email: { type: String, required: true, index: true },
  password: { type: String, required: true },
  stocks: {type: [String], default: undefined},
})

UserSchema.pre('save', function(next) {
  let user = this
  if (!user.isModified('password')) return next()
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err)
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err)
      user.password = hash
      next()
    })
  })
})

UserSchema.methods.comparePassword = function(candidatePassword, done) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return done(err)
    done(null, isMatch)
  })
}

const User = mongoose.model('User', UserSchema)

export default User