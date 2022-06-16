import Requester from '../src/helpers/Requester/index.js';
import Ajax from '../src/helpers/Requester/ajax.js';
import DefaultModel from '../src/helpers/Requester/models/_default.js';

import { expect } from 'chai';

describe('Requester', () => {
    describe('Core', () => {
        it('Not enough args', () => {
            expect(() => new Requester()).to.throw('Invalid apiUrl');
        })

        it('Invalid apiUrl argument (not url)', () => {
            expect(() => new Requester('test123')).to.throw('Invalid apiUrl')
        })

        it('Invalid apiUrl argument (not url)', () => {
            expect(() => new Requester('http://localhost:3000')).to.not.throw('Invalid apiUrl');
        })
    });

    describe('AJAX', () => {
        it('Get params builder', () => {
            const ajax = new Ajax('http://localhost:3000/');

            let test_object = {
                user: 'admin',
                age: 10,
                unicode: 'тест'
            }

            let result = ajax.buildUrlParams(test_object)

            expect(result).to.equal('user=admin&age=10&unicode=%D1%82%D0%B5%D1%81%D1%82')
        })
    })

    describe('Default Request Model', () => {

        describe('Agrument', () => {
            it('Any number', () => {
                expect(() => new DefaultModel(123)).to.throw('Ajax object is required')
            })

            it('Any string', () => {
                expect(() => new DefaultModel('test 123')).to.throw('Ajax object is required')
            })

            it('Any object', () => {
                expect(() => new DefaultModel({
                    a: 1,
                    b: 'test'
                })).to.throw('Ajax object is required')
            })

            it('Boolean', () => {
                expect(() => new DefaultModel(true)).to.throw('Ajax object is required')
            })

            it('Any class', () => {
                let notAjaxClass = class notAjaxClass{}
                let instance = new notAjaxClass();

                expect(() => new DefaultModel(instance)).to.throw('Ajax object is required')
            })

            it('Ajax class', () => {
                const ajax = new Ajax('http://localhost:3000/');
                expect(() => new DefaultModel(ajax)).to.not.throw('Ajax object is required')
            })
        })

        describe('Validate methods', () => {
            const ajax = new Ajax('http://localhost:3000/');
            const model = new DefaultModel(ajax);

            it('list', () => {
                expect(model.list).to.exist;
            })

            it('get', () => {
                expect(model.get).to.exist;
            })

            it('create', () => {
                expect(model.create).to.exist;
            })

            it('update', () => {
                expect(model.update).to.exist;
            })

            it('delete', () => {
                expect(model.delete).to.exist;
            })
        })
    })
})




