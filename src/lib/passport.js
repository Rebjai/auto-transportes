import passport from "passport";
import passportLocal from "passport-local";
import pool from "../database.js";
import helpers from "./helpers.js";

const LocalStrategy = passportLocal.Strategy;
const userTable = 'Usuarios'
const usernameField = 'empleado_id'
const options = {
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}

passport.use('local.signin', new LocalStrategy(options, async (req, username, password, done) => {
  const rows = await pool.query('SELECT * FROM ' + userTable + ' WHERE ' + usernameField + ' = ?', [username]);
  if (rows.length > 0) {
    const user = rows[0];
    const validPassword = await helpers.matchPassword(password, user.clave)
    if (validPassword) {
      done(null, user, req.flash('success', 'Welcome ' + user.empleado_id));
    } else {
      done(null, false, req.flash('message', 'Incorrect Password'));
    }
  } else {
    return done(null, false, req.flash('message', 'The Username does not exists.'));
  }
}));

passport.use('local.signup', new LocalStrategy(options, async (req, username, password, done) => {

  const { fullname } = req.body;
  let newUser = {
    // fullname,
    empleado_id: username,
    clave: password
  };
  newUser.clave= await helpers.encryptPassword(password);
  // Saving in the Database
  let query = 'INSERT INTO ' + userTable + ' SET ? '
  const result = await pool.query(query, newUser);
  newUser.id = result.insertId;
  console.log(newUser);
  return done(null, newUser);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const rows = await pool.query('SELECT '+userTable+'.*, empleado.tipo_empleado FROM ' + userTable + ' INNER JOIN empleado WHERE Usuarios.empleado_id = empleado.id AND Usuarios.id = ?', [id]);
  let user = rows[0]
  user.isAdmin = user.tipo_empleado == 1
  done(null, user);
});