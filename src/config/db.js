import { mongoose } from "../commons/mongo";

const db = async() => {
    try {
      const { DB_USER_NAME, DB_PASS } = process.env;
    await mongoose.connect(
        `mongodb+srv://${DB_USER_NAME}:${DB_PASS}@cluster0.ev45k.mongodb.net/<dbname>?retryWrites=true&w=majority`,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
        }
      );
        console.log('Connected to MONGO DB !')
    } catch (error) {
        console.log(error, 'Error in connecting to DB !')
    }
}

export {
    db as mongooseConnection
}