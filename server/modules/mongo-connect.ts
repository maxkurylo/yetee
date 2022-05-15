import { connect } from 'mongoose';


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

