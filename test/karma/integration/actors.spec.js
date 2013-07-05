
describe('Actors', function () {
    'use strict';
    var baseUrl = '/actors';
    var addActorUrl = '/actors/new';

    beforeEach(function () {
        var deleteActor = function () {
            browser().navigateTo(baseUrl);
            element('table tbody').query(function (tbody, done) {
                var children = tbody.children();

                if (children.length > 0) {
                    element('table tbody a').click();
                    element('.btn-danger').click();
                }

                if (children.length > 1) {
                    deleteActor();
                }

                done();
            });

        };

        deleteActor();
        browser().navigateTo(baseUrl);
    });

    it('should be accessible', function () {
        expect(element('h1').text()).toEqual('Actors List');
    });

    it('should allow adding of actors', function () {
        element('.btn-primary').click();
        expect(browser().window().path()).toEqual('/actors/new');
    });
});