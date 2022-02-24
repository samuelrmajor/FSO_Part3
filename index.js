const { json } = require('express')
const express = require('express')
const app = express()
app.use(express.json())
app.use(express.static('build'))

const cors = require('cors')
app.use(cors())

const morgan = require('morgan')
morgan.token('postcontent', (request) => {
  if (request.method == "POST") {
  return JSON.stringify(request.body)
  }
  else return ""
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postcontent'))



require('dotenv').config()
const Contact = require('./models/contact')


// const generateId = () => {
//   return Math.floor(Math.random() * 1996);
// }


//Gets Specific Ids
app.get('/api/persons/:id', (request, response) => {
  Contact.findById(request.params.id).then(contact => {
    response.json(contact)
  })
})



//Old Get
// app.get('/api/persons', (request, response) => {
//   response.json(contacts)
// })

app.get('/api/persons', (request, response) => {
  Contact.find({}).then(contacts => {
    response.json(contacts)
  })
})

//Not implemented with MangoDB Yet
// app.get('/info', (request, response) => {
//     const currentdatetime = new Date()
//   response.send('Phone book has info for ' + contacts.length.toString() + " people. <br/>"+currentdatetime)
// })

//Not implemented with MangoDB Yet
// app.delete('/api/persons/:id', (request, response) => {
//   const id = Number(request.params.id)
//   contacts = contacts.filter(contact => contact.id !== id)
//   response.status(204).end()
// })


//Creates a new contact (Non Mango DB/OLD)
// app.post('/api/persons', (request, response) => {
//   const body = request.body

//   if (!body.name) {
//     return response.status(400).json({ 
//       error: 'name missing' 
//     })
//   }
//   else if (!body.number) {
//     return response.status(400).json({ 
//       error: 'number missing' 
//     })
//   }

//   else if (contacts.map(contact => contact.name).includes(body.name) ) {
//     return response.status(400).json({ 
//       error: 'this person already exists' 
//     })
//   }
   
//   const contact = {
//     name: body.name,
//     number: body.number,
//     id: generateId(),
//   }

//   contacts = contacts.concat(contact)

//   response.json(contact)
// })




//Does not Check if Contact already exists
app.post('/api/persons', (request, response) => {
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
  })
})








app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})



const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})




