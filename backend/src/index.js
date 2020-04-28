require('dotenv').config()
const server = require('./server')

const port = process.env.PORT || 8888;
server.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
