import { connect, plugin } from 'mongoose';


const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

export default function(mongoUrl: string | undefined) {
    if (!mongoUrl) {
        throw 'Mongo url is missing! Add MONGO_URL environment variable';
    }
    connect(mongoUrl, options)
        .then(() => console.log(`MongoDB connected to ${mongoUrl}`))
        .catch(err => { throw err });
}


plugin((schema: any) => {
    schema.options.toJSON = {
        virtuals: true,
        versionKey: false,
        transform(doc: any, ret: any) {
            ret.id = ret._id.toString();
            delete ret._id;
        }
    };
});
