'use strict';
const router = require('express').Router();

module.exports = () => {
  let routes = {
    'get': {
      '/': (req, res, next) => {
        res.render('login');
      },
      '/rooms': (req, res, next) => {
        res.render('romms');
      },
      '/chat': (req, res, next) => {
        res.render('chatroom');
      }
    },
    'post': {

    }
  }
};
