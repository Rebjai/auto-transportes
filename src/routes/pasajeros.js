import { Router } from "express";
const router = Router();
import pool from "../database.js";
import { isLoggedIn } from "../lib/auth.js";

const table = 'pasajero'
const viewBaseRoute = 'pasajeros'

router.get('/add', async (req, res) => {
    const estaciones = await pool.query('SELECT * FROM estaciones');
    res.render(viewBaseRoute + '/add', { estaciones });
});

router.post('/add', async (req, res) => {
    const { nombre, apellido, correo, clave } = req.body;
    const nuevoPasajero = {
        nombre,
        apellido,
        correo,
        clave
    };
    await pool.query('INSERT INTO ' + table + ' set ?', [nuevoPasajero]);
    req.flash('success', 'El pasajero se ha guardado correctamente');
    res.redirect('/' + viewBaseRoute);
});

router.get('/', isLoggedIn, async (req, res) => {
    const pasajero = await pool.query('SELECT * FROM ' + table);
    res.render(viewBaseRoute + '/list', { pasajero });
});

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM ' + table + ' WHERE ID = ?', [id]);
    req.flash('success', 'Link Removed Successfully');
    res.redirect('/' + viewBaseRoute);
});

router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM ' + table + ' WHERE id = ?', [id]);
    let pasajero = links[0]
    pasajero.clave = ''
    res.render(viewBaseRoute + '/edit', { pasajero: links[0] });
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, correo, clave } = req.body;
    let nuevoPasajero = {
        nombre,
        apellido,
        correo,
        clave
    };
    if (clave == '') {
        nuevoPasajero = {
            nombre,
            apellido,
            correo,
        };
    }

    await pool.query('UPDATE ' + table + ' set ? WHERE id = ?', [nuevoPasajero, id]);
    req.flash('success', 'Link Updated Successfully');
    res.redirect('/' + viewBaseRoute);
});

export default router;