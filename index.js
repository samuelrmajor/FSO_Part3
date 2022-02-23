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

let contacts = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


// const generateId = () => {
//   const maxId = notes.length > 0
//     ? Math.max(...notes.map(n => n.id))
//     : 0
//   return maxId + 1
// }

const generateId = () => {
  return Math.floor(Math.random() * 1996);
}



app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const contact = contacts.find(contact => contact.id === id)
  
  if (contact) {
    response.json(contact)
  } else {
    response.status(404).end()
  }
})

app.get('/api/persons', (request, response) => {
  response.json(contacts)
})


app.get('/info', (request, response) => {
    const currentdatetime = new Date()
  response.send('Phone book has info for ' + contacts.length.toString() + " people. <br/>"+currentdatetime)
})


app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  contacts = contacts.filter(contact => contact.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }
  else if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  else if (contacts.map(contact => contact.name).includes(body.name) ) {
    return response.status(400).json({ 
      error: 'this person already exists' 
    })
  }
   
  const contact = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  contacts = contacts.concat(contact)

  response.json(contact)
})










app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})




