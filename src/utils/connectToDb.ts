import mongoose from 'mongoose'
import config from 'config'
import log from './logger'

async function connectToDb() {
  // config.get takes a generic, here defined as string
  const dbUri = config.get<string>('dbUri')

  try {
    await mongoose.connect(dbUri)
    log.info('Connected to DB')
  } catch (e) {
    process.exit(1)
  }
}

export default connectToDb