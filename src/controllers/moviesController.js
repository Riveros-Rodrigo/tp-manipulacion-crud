const db = require('../database/models');
const sequelize = db.sequelize;
const moment = require('moment')
const {validationResult} = require('express-validator');

//Otra forma de llamar a los modelos
const Movies = db.Movie;

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        res.render('moviesAdd')
    },
    create: function (req, res) {
        const errors = validationResult(req)
        const {title, rating, awards, release_date,length} = req.body //viene del form
        if(errors.isEmpty()){
            db.Movie.create({
                title: title.trim(),
                rating,
                awards,
                release_date,
                length
            })
                .then(movie =>{
                    console.log(movie);
                    return res.redirect('/movies')
                }).catch(error => console.log(error))
        } else{
            return res.render('moviesAdd',{
                errors: errors.mapped(),
                old: req.body,
                title:'Agregar una pelicula'
            })
        }
    },
    edit: function(req, res) {
        db.Movie.findByPk(req.params.id) //siempre va esto porque necesito un id
            .then(movie =>{
                return res.render('moviesEdit',{
                    Movie : movie, 
                    moment
                })
            }).catch(error => console.log(error))
    },
    update: function (req,res) {
        const {title, rating, awards, release_date,length} = req.body //viene del form
        db.Movie.update(
            {
                title: title.trim(),
                rating,
                awards,
                release_date,
                length
            },
            {
                where: {
                    id: req.params.id
                }
            }
        ).then(response =>{ //el then dsp de usar el update te devuelve un array con el valor de 1 si hubo cambio o 0 si no hubo cambio
            console.log(response);
            return res.redirect('/movies/detail/' + req.params.id)
        }).catch(error => console.log(error))
    },
    delete: function (req, res) {
        db.Movie.findByPk(req.params.id)
        .then(movie => {
            res.render('moviesDelete.ejs', {Movie:movie});
        }).catch(error => console.log(error))
    },
    destroy: function (req, res) {
        //como algunas peliculas estan vinculadas con el fk tengo que hacer destroy otra vez
        db.ActorMovie.destroy({
            where:{movie_id: req.params.id}
        }).then(moviesDestroy =>{
            console.log(moviesDestroy);
            //Acá hago update porque tenia actores con vincula en la pelicula ya que era su peli favorita, por eso hago update asi lo edita y me deja borrar la peli
            db.Actor.update(
                {
                    favorite_movie_id:null
                },
                {
                    where:{
                        favorite_movie_id: req.params.id
                    }
            }).then(response =>{
                console.log(response);
                db.Movie.destroy({
                    where:{id: req.params.id}
                }).then(response =>{
                    console.log(response);
                    res.redirect('/movies')
                })
            })
        }).catch(error => console.log(error))
    }

}

module.exports = moviesController;