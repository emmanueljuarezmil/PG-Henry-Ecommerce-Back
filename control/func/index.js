const axios = require('axios');
const {  } = require('../db/index.js');
const { v4: uuidv4 } = require('uuid');
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;

const get = (req,res, next) => {
    res.send();
}