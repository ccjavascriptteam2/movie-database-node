/*jshint maxstatements:50 */

'use strict';

exports = module.exports = function (db) {

    if (!db) {
        // Default database provider: Neo4j
        var neo4j = require('neo4j');
        var config = require('../config');
        db = new neo4j.GraphDatabase(config.neo4j.url);
    }

    var exports = {};

    exports.movies = require('./movies')(db);
    exports.actors = require('./actors')(db);
    exports.hello = require('./hello')();

    return exports;
};
