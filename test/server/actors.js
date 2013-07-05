'use strict';
var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var neo4j = require('neo4j');
var ResponseMock = require('./helper/response-mock');

describe('getActor', function () {
    var dbStub;
    var routes;
    var actors;
    var res;

    beforeEach(function() {
        dbStub = sinon.createStubInstance(neo4j.GraphDatabase);
        routes = require('../../server/routes')(dbStub);
        actors = routes.actors;
        res = new ResponseMock();
    });

    it('should return an empty list when neo returns null', function (done) {
        dbStub.getIndexedNodes
            .withArgs('node_auto_index', 'type', 'actor')
            .yieldsAsync(
                null,
                null
            );

        actors.getActors({}, res);

        res.verifySend(function() {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.instanceOf(Array);
            expect(res.body).to.be.empty;
            done();
        });
    });

    it('should return an empty list when neo returns []', function (done) {
        dbStub.getIndexedNodes
            .withArgs('node_auto_index', 'type', 'actor')
            .yieldsAsync(
                null,
                null
            );

        actors.getActors({}, res);

        res.verifySend(function() {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.instanceOf(Array);
            expect(res.body).to.be.empty;
            done();
        });
    });

    it('should return a list of actors', function (done) {
        dbStub.getIndexedNodes
            .withArgs('node_auto_index', 'type', 'actor')
            .yieldsAsync(
                null,
                [{data: {name:'Nicole', biography:'Nicole lives in ...'}},
                 {data: {name:'Denzel', biography:'Denzel was born in ... '}}]
            );

        actors.getActors({}, res);

        res.verifySend(function() {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.instanceOf(Array);
            expect(res.body).to.have.length(2);
            expect(res.body[0]).to.have.property('name')
                .that.equals('Nicole');
            done();
        });
    });


});

