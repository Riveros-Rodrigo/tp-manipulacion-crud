const {check} = require('express-validator');

module.exports = [
    //Validar campos obligatorios
    check('title')
        .notEmpty().withMessage('El titulo de la pelicula es obligatorio'),
    check('rating')
        .notEmpty().withMessage('El rating de la pelicula es obligatorio').bail()
        .isDecimal().withMessage('El rating de la pelicula debe ser un número'),
    check('release_date')
        .notEmpty().withMessage('La fecha de estreno es obligatoria'),
    check('length')
        .notEmpty().withMessage('El tiempo de duración es obligatorio').bail()
        .isNumeric().withMessage('El tiempo de duración debe ser un número').bail()
        .custom((value) => {
            const durationInMinutes = +value;
            if (durationInMinutes >= 60) {
                return true;
            }
        }).withMessage('La duración tiene que ser mas de 1 hora')
]