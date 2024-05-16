var conn = require('./../inc/db');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    conn.query('SELECT * FROM `tb_menus` ORDER BY `title`', (err, results) => {
        if (err) {
            console.error(err);
        }

        res.render('index', {
            title: 'Restaurante Saboroso!',
            menus: results,
        });
    });
});

/* GET contacts page. */
router.get('/contacts', function (req, res, next) {
    res.render('contacts', {
        title: 'Contato - Restaurante Saboroso!',
    });
});

/* GET menu page. */
router.get('/menus', function (req, res, next) {
    res.render('menus', {
        title: 'Cardápio - Restaurante Saboroso!',
    });
});

/* GET reservations page. */
router.get('/reservations', function (req, res, next) {
    res.render('reservations', {
        title: 'Reserva - Restaurante Saboroso!',
    });
});

/* GET services page. */
router.get('/services', function (req, res, next) {
    res.render('services', {
        title: 'Serviços - Restaurante Saboroso!',
    });
});

module.exports = router;
