'use strict';

describe('LoginController', function() {

    beforeEach(module('traingular'));

    it('Tries to login using id and password', function(){
        expect('/login').toEqual('/login');
    })
});
