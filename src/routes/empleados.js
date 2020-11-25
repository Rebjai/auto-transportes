import { Router } from "express";
const router = Router();
import pool from "../database.js";
import { isLoggedIn } from "../lib/auth.js";

const table = 'empleado'
const viewBaseRoute = 'empleados'

router.get('/add', async (req, res) => {
    const area = await pool.query('SELECT * FROM area');
    const tipo_empleado = await pool.query('SELECT * FROM tipo_empleado');
    res.render(viewBaseRoute + '/add', { area, tipo_empleado });
});

router.post('/add', async (req, res) => {
    const { id, area, tipo_empleado, nombre, apellidos, fecha_nacimiento, activo } = req.body;
    const newLink = {
        id,
        area,
        tipo_empleado,
        nombre,
        apellidos,
        fecha_nacimiento,
        activo
        // user_id: req.user.id
    };
    await pool.query('INSERT INTO ' + table + ' set ?', [newLink]);
    req.flash('success', 'Link Saved Successfully');
    res.redirect('/' + viewBaseRoute);
});

router.get('/', isLoggedIn, async (req, res) => {
    const employes = await pool.query('SELECT empleado.*, tipo_empleado.nombre as tipo_empleado, area.nombre as area FROM ' + table + ' INNER JOIN tipo_empleado ON ' + table + '.tipo_empleado=tipo_empleado.id INNER JOIN area ON ' + table + '.area=area.id');
    console.log(employes);
    res.render(viewBaseRoute + '/list', { employes });
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
    console.log(links);
    res.render(viewBaseRoute + '/edit', { link: links[0] });
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