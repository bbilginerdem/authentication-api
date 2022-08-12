// Due to Node's single-threaded event-loop, it's highly recommended that sending, alert triggering, 
// reformatting and all forms of log processing be conducted in a separate process or thread
import logger from 'pino'
// to format day & time
import dayjs from 'dayjs'
import config from 'config'

const level = config.get<string>('logLevel')

const log = logger({
  transport: {
    target: 'pino-pretty'
  },
  level,
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
})

export default log;