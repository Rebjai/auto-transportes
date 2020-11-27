import { Router } from "express";
const router = Router();
import pool from "../database.js";
import {isLoggedIn} from "../lib/auth.js";

const table = 'ruta'

router.get('/add',async (req, res) => {
    const estaciones = await pool.query('SELECT * FROM estaciones');
    const vehiculo = await pool.query('SELECT * FROM vehiculo');
    res.render('rutas/add', {estaciones, vehiculo});
});

router.post('/add', async (req, res) => {
    const { vehiculo, destino, origen, activo, capacidad, hora, precio } = req.body;
    const nuevaRuta = {
        vehiculo, 
        destino, 
        origen, 
        activo, 
        capacidad, 
        hora, 
        precio
    };
    await pool.query('INSERT INTO ' + table + ' set ?', [nuevaRuta]);
    req.flash('success', 'Link Saved Successfully');
    res.redirect('/rutas');
});

router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM ' + table);
    res.render('rutas/list', { links });
});

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM ' + table + ' WHERE ID = ?', [id]);
    req.flash('success', 'Link Removed Successfully');
    res.redirect('/rutas');
});

router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM ' + table + ' WHERE id = ?', [id]);
    console.log(links);
    res.render('rutas/edit', {link: links[0]});
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, url} = req.body; 
    const newLink = {
        title,
        description,
        url
    };
    await pool.query('UPDATE ' + table + ' set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Link Updated Successfully');
    res.redirect('/rutas');
});

export default router;