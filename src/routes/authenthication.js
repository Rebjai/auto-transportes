
import express from "express";
import passport from "passport";
import {isLoggedIn} from "../lib/auth.js";
import { check, validationResult } from "express-validator";
import pool from "../database.js";

const router = express.Router();

// const { isLoggedIn } = require('../lib/auth');
const loginValidation = [check('username', 'Username is Required').notEmpty(),check('password', 'Password is Required').notEmpty()]

// SIGNUP
router.get('/signup', async (req, res) => {
  const empleado = await pool.query('SELECT * FROM empleado');
  res.render('auth/signup',{empleado});
});

router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
}));

// SINGIN
router.get('/signin', (req, res) => {
  res.render('auth/signin');
});

router.post('/signin',loginValidation, (req, res, next) => {
  let valid = validationResult(req)
  const errors = valid.errors;
  if (errors.length > 0) {
    req.flash('message', errors[0].msg);
    res.redirect('/signin');
    return 
  }
  passport.authenticate('local.signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/');
});

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile');
});

export default router;