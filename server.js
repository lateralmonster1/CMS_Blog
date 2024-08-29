const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { sequelize } = require('./config/connection');
const exphbs = require('express-handlebars');
const path = require('path');
const { Sequelize } = require('sequelize');
const CustomPostgresQueryGenerator = require('./utils/custom-postgres-query-generator.js');

const db = new Sequelize ('database', 'username', 'password', {
  dialect: 'postgres',
  queryGenerator: new CustomPostgresQueryGenerator(), // Use custom query generator
  // other options
});

module.exports = sequelize;

const app = express();
const PORT = process.env.PORT || 3001;

const hbs = exphbs.create({});
const sess = {
  secret: 'Super secret secret',
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(require('./controllers'));

sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
});
