import { Router } from "express";
const router = Router();
import pool from "../database.js";
import {isLoggedIn} from "../lib/auth.js";

const table = 'boletos'
const viewBaseRoute = 'boletos'

router.get('/add',async (req, res) => {
    const estaciones = await pool.query('SELECT * FROM estaciones');
    const pasajero = await pool.query('SELECT * FROM pasajero');
    const vehiculo = await pool.query('SELECT * FROM vehiculo');
    const taquilla = await pool.query('SELECT * FROM taquilla');
    const ruta = await pool.query(`SELECT t.*, 
    t1.estado as origen, t2.estado as destino
    FROM ruta as t
    JOIN estaciones t1 ON t1.id = t.origen
    JOIN estaciones t2 ON t2.id = t.destino`);
    res.render(viewBaseRoute+'/add', {estaciones, ruta, pasajero, vehiculo, taquilla});
});

router.post('/add', async (req, res) => {
    const { vehiculo, taquilla, ruta, pasajero, asiento} = req.body;
    let hora = new Date().toISOString().slice(0, 19).replace('T', ' ')

    const nuevoBoleto = {
        vehiculo, 
        taquilla, 
        ruta, 
        pasajero, 
        hora, 
        asiento
    };
    await pool.query('INSERT INTO ' + table + ' set ?', [nuevoBoleto]);
    req.flash('success', 'Link Saved Successfully');
    res.redirect('/'+viewBaseRoute);
});

router.get('/', isLoggedIn, async (req, res) => {
    // const boleto = await pool.query('SELECT * FROM ' + table);
    const boleto = await pool.query(`SELECT t.*, 
    t1.nombre as pasajero, t2.placas as vehiculo
    FROM ${table} as t
    JOIN pasajero t1 ON t1.id = t.pasajero
    JOIN vehiculo t2 ON t2.id = t.vehiculo`);
    
    res.render(viewBaseRoute+'/list', { boleto });
});

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM ' + table + ' WHERE ID = ?', [id]);
    req.flash('success', 'Link Removed Successfully');
    res.redirect('/'+viewBaseRoute);
});

router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM ' + table + ' WHERE id = ?', [id]);
    const estaciones = await pool.query('SELECT * FROM estaciones');
    const pasajero = await pool.query('SELECT * FROM pasajero');
    const vehiculo = await pool.query('SELECT * FROM vehiculo');
    const taquilla = await pool.query('SELECT * FROM taquilla');
    const ruta = await pool.query(`SELECT t.*, 
    t1.estado as origen, t2.estado as destino
    FROM ruta as t
    JOIN estaciones t1 ON t1.id = t.origen
    JOIN estaciones t2 ON t2.id = t.destino`);
    console.log(links);
    res.render(viewBaseRoute+'/edit', {boleto: links[0],estaciones, ruta, pasajero, vehiculo, taquilla});
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
    res.redirect('/'+viewBaseRoute);
});

export default router;