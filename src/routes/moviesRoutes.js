const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/moviesController');
const moviesAddValidator = require('../validations/addValidator')

router.get('/movies', moviesController.list);
router.get('/movies/new', moviesController.new);
router.get('/movies/recommended', moviesController.recomended);
router.get('/movies/detail/:id', moviesController.detail);


//Rutas exigidas para la creación del CRUD
router.get('/movies/add', moviesController.add); // para agregar va con add
router.post('/movies/create',moviesAddValidator, moviesController.create); //para crear va con post
router.get('/movies/edit/:id', moviesController.edit); //ruta parametrisada
router.put('/movies/update/:id', moviesController.update); //para editar va el put
router.get('/movies/delete/:id', moviesController.delete);
router.delete('/movies/delete/:id', moviesController.destroy); // para eliminar delete

module.exports = router;