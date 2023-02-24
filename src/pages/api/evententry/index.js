import mongoose, { Schema } from 'mongoose'

// export const config = {
//   api: {
//     bodyParser: false
//   }
// }
mongoose.connect(process.env.MONGODB_URI || '', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const schema = {
  businessId: { type: Schema.Types.ObjectId },
  myPageId: [Schema.Types.ObjectId],
  componentId: [Schema.Types.ObjectId],
  eventCreatedAt: { type: Date, require: true, index: { unique: true } },
  context: { type: Object },
  data: { type: Object },
  eventType: { type: String },
}

let EventEntry;

const newSchema = new Schema(schema, { timestamps: true })
try {
  // Trying to get the existing model to avoid OverwriteModelError
  EventEntry = mongoose.model("EventEntry");
} catch {
    EventEntry = mongoose.model("EventEntry", newSchema);
}

export default async function handler(req, res) {
  // res.setHeader('Content-Type', 'application/json')  
  // res.headers.set('Content-Type', 'application/json')  

    if (req.method === 'POST') {
      const { bid, pid, createdAt, context, data, eventType, componentId } = req.body
    
    const newEventEntry = {
        businessId: bid,
        myPageId: pid,
        componentId,
        eventCreatedAt: new Date(createdAt),
        context,
        data,
        eventType
    }

    try {

        const result = await EventEntry.create(newEventEntry)
        console.log('Event entry result', result)
    
        return res.status(200).send()
    } catch (error) {
        console.log(error)
        if (error.message) return res.status(400).json({ message: error.message })
        return res.status(400).json({ message: 'Occorreu um esquerro inesperado. Entrar em contato com o administrador' })
    }

    }

    return res.status(200).json({ message: 'Health check ok' })
};