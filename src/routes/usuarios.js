import { Router } from "express";
const router = Router();
import pool from "../database.js";
import { isLoggedIn } from "../lib/auth.js";

const table = 'usuarios'
const viewBaseRoute = 'usuarios'

router.get('/add', async (req, res) => {
    const area = await pool.query('SELECT * FROM area');
    const tipo_empleado = await pool.query('SELECT * FROM tipo_empleado');
    res.render(viewBaseRoute + '/add', { area, tipo_empleado });
});

router.post('/add', async (req, res) => {
    const { id, area, tipo_empleado, nombre, apellidos, fecha_nacimiento, activo } = req.body;
    const nuevoUsuario = {
        id,
        area,
        tipo_empleado,
        nombre,
        apellidos,
        fecha_nacimiento,
        activo
        // user_id: req.user.id
    };
    await pool.query('INSERT INTO ' + table + ' set ?', [nuevoUsuario]);
    console.log(newLink);
    req.flash('success', 'Link Saved Successfully');
    res.redirect('/' + viewBaseRoute);
});

router.get('/', isLoggedIn, async (req, res) => {
    const usuario = await pool.query('SELECT * FROM ' + table);
    res.render(viewBaseRoute + '/list', { usuario });
});

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM ' + table + ' WHERE ID = ?', [id]);
    req.flash('success', 'Employee Removed Successfully');
    res.redirect('/' + viewBaseRoute);
});

router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM ' + table + ' WHERE id = ?', [id]);
    console.log(links);
    res.render(viewBaseRoute + '/edit', { usuarios: links[0] });
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, url } = req.body;
    const newLink = {
        title,
        description,
        url
    };
    await pool.query('UPDATE ' + table + ' set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Link Updated Successfully');
    res.redirect('/' + viewBaseRoute);
});

export default router;