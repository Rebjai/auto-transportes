import morgan from "morgan";
import Express from "express";
import path from "path";
import exphbs from "express-handlebars";
import session from "express-session";
// import {} from  "express-validator";
import passport from "passport";
import flash from "connect-flash";
import expressMySQLSession from "express-mysql-session";
import {database} from "./keys.js";

// routes
import index from "./routes/index.js";
import authentication from "./routes/authenthication.js";
import rutas from "./routes/rutas.js";
import empleados from "./routes/empleados.js";
import pasajeros from "./routes/pasajeros.js";
import boletos from "./routes/boletos.js";
//modules workaround
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// import handlebars from "./"
const MySQLStore = expressMySQLSession(session);
// const bodyParser = require('body-parser');


// Intializations
const app = Express();
import "./lib/passport.js"
// require('./lib/passport');
console.log(__dirname)
// Settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
}))
//   helpers: require('./lib/handlebars.js')
app.set('view engine', '.hbs');

// Middlewares
app.use(morgan('dev'));
app.use(Express.urlencoded({extended: true}));
app.use(Express.json());

app.use(session({
  secret: 'AutotransportesSecreto',
  resave: false,
  saveUninitialized: false,
  store: new MySQLStore(database)
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// app.use(validator());

// Global variables
app.use((req, res, next) => {
  app.locals.message = req.flash('message');
  app.locals.success = req.flash('success');
  app.locals.user = req.user;
  next();
});


// Routes
app.use(index);
app.use(authentication);
app.use('/rutas', rutas);
app.use('/empleados', empleados);
app.use('/boletos', boletos);
app.use('/pasajeros', pasajeros);

// Public
app.use(Express.static(path.join( __dirname, 'public')));

// Starting
app.listen(app.get('port'), () => {
  console.log('Server is in port', app.get('port'));
});