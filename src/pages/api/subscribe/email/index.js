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

const subscribeSchema = {
  businessSlug: String,
  type: String,
  data: String,
  active: Boolean,
  businessId: Schema.Types.ObjectId
};

let Subscribe;

const newSchema = new Schema(subscribeSchema, { timestamps: true })
try {
  // Trying to get the existing model to avoid OverwriteModelError
  Subscribe = mongoose.model("Subscribe");
} catch {
    Subscribe = mongoose.model("Subscribe", newSchema);
}

export default async function handler(req, res) {
  // res.setHeader('Content-Type', 'application/json')  
  // res.headers.set('Content-Type', 'application/json')  

    if (req.method === 'POST') {
      const { businessSlug, type, data, businessId } = req.body
      if (!businessSlug || !type || !data) return res.status(401).json({ message: 'Dado faltando' })
  
      const isSubscribed = await Subscribe.findOne({ businessSlug, type, data, active: true })
      console.log('isSubscribed', isSubscribed)
      if (isSubscribed) return res.status(400).json({ message: 'Registro duplicado', data: isSubscribed })
  
      const subscribed = await Subscribe.create({
          businessSlug,
          type,
          data,
          businessId,
          active: true
      })
      return res.status(200).json({ message: 'Inscrito', data: subscribed })
    }

    if (req.method === 'PUT') {
      const { data } = req.body
      console.log('data', data)
      if (!data) return res.status(401).json({ message: 'Dado faltando' })
  
      const subscribed = await Subscribe.findById(data)
      console.log('subscribed', subscribed)
      if (!subscribed) return res.status(400).json({ message: 'Registro não encontrado' })
  
      subscribed.active = false
      await subscribed.save()
      return res.status(200).json({ message: 'Inscrição removida' })
    }

    return res.status(200).json({ message: 'Health check ok' })
};