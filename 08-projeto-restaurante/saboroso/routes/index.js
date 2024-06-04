var conn = require('./../inc/db');
var express = require('express');
var menus = require('./../inc/menus');
var reservations = require('./../inc/reservations');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    menus.getMenus().then((results) => {
        res.render('index', {
            title: 'Restaurante Saboroso!',
            menus: results,
            isHome: true,
        });
    });
});

/* GET contacts page. */
router.get('/contacts', function (req, res, next) {
    res.render('contacts', {
        title: 'Contato - Restaurante Saboroso!',
        background: 'images/img_bg_3.jpg',
        h1: 'Aguardamos o seu contato!',
    });
});

/* GET menu page. */
router.get('/menus', function (req, res, next) {
    menus.getMenus().then((results) => {
        res.render('menus', {
            title: 'Cardápio - Restaurante Saboroso!',
            background: 'images/img_bg_1.jpg',
            h1: 'Saboreie nossos pratos!',
            menus: results,
        });
    });
});

/* GET reservations page. */
router.get('/reservations', function (req, res, next) {
    reservations.render(req, res);
});

/* POST reservations form. */
router.post('/reservations', function (req, res, next) {
    if (!req.body.name) {
        reservations.render(req, res, 'Digite o seu nome.');
    } else if (!req.body.email) {
        reservations.render(req, res, 'Digite o seu e-mail.');
    } else if (!req.body.people) {
        reservations.render(req, res, 'Selecione o nro. de pessoas.');
    } else if (!req.body.date) {
        reservations.render(req, res, 'Selecione a data da reserva.');
    } else if (!req.body.time) {
        reservations.render(req, res, 'Selecione a hora da reserva.');
    } else {
        reservations
            .save(req.body)
            .then((results) => {
                req.body = {};
                reservations.render(req, res, null, 'Reserva efetuada com sucesso!');
            })
            .catch((err) => {
                reservations.render(req, res, err.message);
            });
    }
});

/* GET services page. */
router.get('/services', function (req, res, next) {
    res.render('services', {
        title: 'Serviços - Restaurante Saboroso!',
        background: 'images/img_bg_1.jpg',
        h1: 'É um prazer poder servir!',
    });
});

module.exports = router;
