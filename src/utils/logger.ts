import logger from 'pino'
import dayjs from 'dayjs'
import config from 'config'

const level = config.get < string > </>('logLevel')