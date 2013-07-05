/*jshint maxstatements:50 */

'use strict';
var uuid = require('node-uuid');

exports = module.exports = function (db) {

    if (!db) {
        throw new Error('No database configured');
    }

    var exports = {};

    function getAbsoluteUriBase (req) {
        // we use req.get('host') as this also gives us the port
        return req.protocol + '://' + req.get('host');
    }

    exports.getMovies = function (req, res) {
        db.getIndexedNodes('node_auto_index', 'type', 'movie',
                function (err, nodes) {
            if (err) {
                console.error(err);
                return res.status(500).send();
            }

            // fallback in case no movies are stored in the database
            nodes = nodes || [];

            var movies = nodes.map(function (node) {
                return node.data;
            });

            res.send(movies);
        });
    };


    exports.getMovie = function (req, res) {
        var id = req.params.id;

        db.getIndexedNode('node_auto_index', 'id', id, function (err, node) {
            if (err) {
                res.status(500).send();
                console.error(err);
            } else if (!node) {
                res.status(404).send();
            } else {
                res.send(node.data);
            }
        });
    };


    exports.deleteMovie = function (req, res) {
        var id = req.params.id;
        console.log('Deleting movie ' + id);

        var cypher = 'START node=node:node_auto_index(id={id}) ' +
            'MATCH node-[relationship?]-() ' +
            'DELETE node, relationship';
        db.query(cypher, { id: id }, function (err) {
            if (err) {
                console.error(err);
                return res.status(500).send();
            }

            res.status(204).send();
        });
    };


    exports.addMovie = function (req, res) {
        var node = db.createNode(req.body);
        node.data.type = 'movie';
        node.data.id = uuid.v4();
        node.save(function (err, savedNode) {
            if (err) {
                console.error(err);
                return res.status(500).send();
            }

            res.status(201)
                .header('Location', getAbsoluteUriBase(req) +
                    '/movies/' + node.data.id)
                .send(savedNode.data);
        });
    };


    exports.updateMovie = function (req, res) {
        var id = req.params.id;
        db.getIndexedNode('node_auto_index', 'id', id, function (err, node) {
            if (err) {
                console.error(err);
                return res.status(500).send();
            } else if (!node) {
                return res.status(404).send();
            }
            node.data.title = req.body.title;
            node.data.description = req.body.description;
            node.save(function (err, savedNode) {
                if (err) {
                    console.error(err);
                    return res.status(500).send();
                }

                res.send(savedNode.data);
            });
        });
    };

    exports.getActorsForMovie = function (req, res) {
        // fallback in case no movies are stored in the database
        var nodes = nodes || [];

        res.send(nodes);
    };

    exports.addActorForMovie = function (req, res) {
        var movieId = req.params.id;
        var actorId = req.body.actor;
        console.log('about to add actor ' + actorId + ' to movie ' + movieId);
        db.getIndexedNode('node_auto_index', 'id', movieId,
               function (err, movieNode) {
            if (err) {
                console.error(err);
                return res.status(500).send();
            } else if (!movieNode) {
                console.warn('could not find movie ' + movieId);
                return res.status(404).send();
            }
            console.log('found movie ' + movieId);
            db.getIndexedNode('node_auto_index', 'id', actorId,
                function (err, actorNode) {
                if (err) {
                    console.error(err);
                    return res.status(500).send();
                } else if (!actorNode) {
                    console.warn('could not find actor ' + actorId);
                    return res.status(404).send();
                }
                console.log('found actor ' + actorId);
                movieNode.createRelationshipTo(actorNode, 'movieactor', {},
                  function(err, savedRelationship) {
                    if (err) {
                        console.error(err);
                        return res.status(500).send();
                    }
                    console.info('successfully added actor ' + actorId + ' to movie ' + movieId);
                    res.status(201).send(savedRelationship.data);
                });
            });
        });
    };

    return exports;
};
