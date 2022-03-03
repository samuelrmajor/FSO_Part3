const { json } = require('express')
const express = require('express')
const app = express()
app.use(express.json())
app.use(express.static('build'))

//Allows Cors
const cors = require('cors')
app.use(cors())

//Prints Requests (*Custom Morgan Printout*)
const morgan = require('morgan')
morgan.token('postcontent', (request) => {
  if (request.method == "POST") {
  return JSON.stringify(request.body)
  }
  else return ""
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postcontent'))

//Loads Env Variables (Such as port and Mongo DB Password)
require('dotenv').config()

//Mongo Models
//Contact
const Contact = require('./models/contact')


//REST API paths

//HTTP Get:  All Ids
app.get('/api/persons', (request, response) => {
  Contact.find({}).then(contacts => {
    response.json(contacts)
  })
})

//HTTP Get:  Specific Ids
app.get('/api/persons/:id', (request, response, next) => {
  Contact.findById(request.params.id).then(contact => {
    response.json(contact)
  }).catch(error => next(error))
})



// Not implemented with MangoDB Yet
// GET: Returns number of contacts and current time
app.get('/info', (request, response) => {    
    Contact.count({}).then(contacts => {
      const currentdatetime = new Date()
      response.send('Phone book has info for ' + contacts.toString() + " people. <br/>"+currentdatetime)
    }).catch(error => console.log(error))
  
})

//GET: Homepage Info (Basic)
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})




//DELETE: Deletes Contact by ID
app.delete('/api/persons/:id', (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})





//POST: Creates new Contact
// If number or name are not included, not posted and returns error
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: 'name missing' })
  }

  else if (body.number === undefined) {
    return response.status(400).json({ error: 'number missing' })
  }

  const contact = new Contact({
    name: body.name,
    number: body.number,
    date: new Date(),
  })

  contact.save().then(savedContact => {
    response.json(savedContact)
  }).catch(
    error => next(error))
})


//PUT: Updates Current Contact number
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Contact.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
    .then(updatedContact => {
      response.json(updatedContact)
    })
    .catch(error => next(error))
})






//Error Handling Middleware (Last)
const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  console.error(error.name)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)





const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})




