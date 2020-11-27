import { Router } from "express";
const router = Router();
import pool from "../database.js";
import { isLoggedIn } from "../lib/auth.js";
import { parseMonth, parse2digit } from "../lib/aux.js";

const table = 'ruta'

router.get('/add', async (req, res) => {
    const estaciones = await pool.query('SELECT * FROM estaciones');
    const vehiculo = await pool.query('SELECT * FROM vehiculo');
    res.render('rutas/add', { estaciones, vehiculo });
});

router.post('/add', async (req, res) => {
    const { vehiculo, destino, origen, activo, capacidad, hora, precio, dia } = req.body;
    let fechasql = dia + ' ' + hora
    const nuevaRuta = {
        vehiculo,
        destino,
        origen,
        activo,
        capacidad,
        hora: fechasql,
        precio
    };
    await pool.query('INSERT INTO ' + table + ' set ?', [nuevaRuta]);
    req.flash('success', 'Link Saved Successfully');
    res.redirect('/rutas');
});

router.get('/', isLoggedIn, async (req, res) => {
    const ruta = await pool.query(`SELECT t.*, 
    t1.nombre as origen, t2.nombre as destino, t3.placas as vehiculo
    FROM ruta as t
    JOIN estaciones t1 ON t1.id = t.origen
    JOIN estaciones t2 ON t2.id = t.destino
    JOIN vehiculo t3 ON t3.id = t.vehiculo`);
    res.render('rutas/list', { ruta });
});

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM ' + table + ' WHERE ID = ?', [id]);
    req.flash('success', 'Link Removed Successfully');
    res.redirect('/rutas');
});

router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const estaciones = await pool.query('SELECT * FROM estaciones');
    const vehiculo = await pool.query('SELECT * FROM vehiculo');
    const links = await pool.query('SELECT * FROM ' + table + ' WHERE id = ?', [id]);
    let ruta = links[0]
    const hora = new Date (ruta.hora)
    let dia = hora.getFullYear() + '-' + parseMonth(hora.getMonth()) + '-' + hora.getDate()
    ruta.dia = dia
    ruta.hora = parse2digit(hora.getHours()) + ':'+ hora.getMinutes()+':'+ parse2digit(hora.getSeconds())
    console.log(ruta);

    res.render('rutas/edit', { ruta, estaciones, vehiculo });
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { vehiculo, destino, origen, activo, capacidad, hora, precio, dia } = req.body;
    let fechasql = dia + ' ' + hora
    const nuevaRuta = {
        vehiculo,
        destino,
        origen,
        activo,
        capacidad,
        hora: fechasql,
        precio
    };
    await pool.query('UPDATE ' + table + ' set ? WHERE id = ?', [nuevaRuta, id]);
    req.flash('success', 'Link Updated Successfully');
    res.redirect('/rutas');
});

export default router;