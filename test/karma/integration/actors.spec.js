
describe('Actors', function () {
    'use strict';
    var baseUrl = '/actors';
    // var addActorUrl = '/actors/new';

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

    it('should add actor and forward to the detail view', function () {
        var name = 'Denzel Washington';
        var bio = 'Denzel was born in ...';

        // add actor
        browser().navigateTo(addActorUrl);
        input('actor.name').enter(name);
        input('actor.biography').enter(bio);
        element('.btn-primary').click();

        // make sure it has been saved
        expect(browser().window().path()).toMatch(/^\/actors\/.*$/);
        expect(element('h2').text()).toEqual(name);

        // look for it on the overview page
        browser().navigateTo(baseUrl);
        expect(repeater('table tbody tr').count()).toBeGreaterThan(0);
    });

});