import dotenv from "dotenv";
dotenv.config();

export const Urls = {
  MONDO_DB_CONNECTION_URL: `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.oksn8.mongodb.net/?retryWrites=true&w=majority`,
};
