const app = require('./app').default
const logger = require('./utils/logger')
const config = require('./utils/config')

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})