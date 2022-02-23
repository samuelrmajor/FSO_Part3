const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}


const password = process.argv[2]

const url =
  `mongodb+srv://srm:${password}@cluster0.qdece.mongodb.net/contactsApp?retryWrites=true&w=majority`

mongoose.connect(url)

const contactSchema = new mongoose.Schema({
  // id: Number,
  name: String,
  number: String
})

const Contact = mongoose.model('contact', contactSchema)





if (process.argv.length < 4) {
  console.log('All contacts: ')
  Contact.find({}).then(result => {
  result.forEach(contact => {
    console.log(contact.name, contact.number)
  })
  mongoose.connection.close()
})
}

else if (process.argv.length < 5) {
  console.log("enter Name and Number")
  process.exit(1)
}

else {
  const contact = new Contact({
  // id: what is it?,
  name: process.argv[3],
  number: process.argv[4]
})

contact.save().then(result => {
  console.log('contact saved!')
  mongoose.connection.close()
})


}



