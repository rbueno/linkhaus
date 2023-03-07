import mongoose, { Schema } from 'mongoose'

mongoose.connect(process.env.MONGODB_URI || '', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const bioPageSchema = {
    businessId: {
        type: Schema.Types.ObjectId,
        ref: 'Business'
    },
    pageSlug: { type: String, require: true, index: { unique: true } },
    address: { type: String },
    description: { type: String },
    name: { type: String },
    themeColor: { type: String },
    meta: { type: Object },
    header: { type: Object },
    sections: [Object],
    active: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
    s3BucketDir: { type: String },
    avatarURL: { type: String }

}

let BioPage;

const newSchema = new Schema(bioPageSchema, { timestamps: true })
try {
  // Trying to get the existing model to avoid OverwriteModelError
  BioPage = mongoose.model("BioPage");
} catch {
    BioPage = mongoose.model("BioPage", newSchema);
}

export default async function handler(req, res) {

    if (req.method === 'GET') {
        const { pageSlug } = req.params
        console.log('===========> pageSlug', pageSlug)
      if (!pageSlug) return res.status(400).json({  message: 'Ocorreu um erro inesperado' })
      
      const myPage = await BioPage.findOne({ pageSlug })

      if (!myPage) {
        return res.status(400).json({ message: 'Nenhum myPage encontrado' })
    }

    res.status(200).json({ myPage })
    }

   

    return res.status(200).json({ message: 'Health check ok' })
};