'use strict'

const data = require('../../data');
const models = data.models;
const log = require('../../log');
const Boom = require('boom');
const _ = require('lodash');
const httpUtil = require('../../util/httpUtil');
var jql = require('../../data/index.js').jql;
const { VM } = require('vm2');

module.exports = {
    index: async function (ctx) {
        // try {
        await ctx.render('jollofadmin/admin', { models: data.models });

        // } catch (err){
        // 	log.error(err);
        // }
    },

    models: async function (ctx) {
        //generate a list of model schemas and send it down
        //try {
        let schemas = [];
        _.each(models, (model) => {
            schemas.push(model.schema);
        });

        ctx.body = schemas;
        //} catch (err) {
        //    httpUtil.handleError(ctx, err);
        //}
    },

    //List all
    /**
     *
     * @param modelName
     *
     * HTTP Params
     * query.page - default 1
     * query.limit
     * query.sort e.g -id, id, -age
     * query.sort e.g -id, id, -age
     */
    list: async function (ctx) {
        //try {

        const modelName = ctx.params.modelName;

        if (!modelName || !models[modelName]) {
            throw new Boom.badRequest('Model: ' + modelName + ' does not exist');
            //return [];
        }

        const opts = {};

        if (ctx.query.sort) {
            opts.sort = JSON.parse(ctx.query.sort);
        }
        if (ctx.query.paging) {
            opts.paging = JSON.parse(ctx.query.paging);
        }

        //turn conditions to JQA, in separate context, with a 500ms timeout
        let vmctx = Object.create(null); //create a context for the vm that does NOT have a prototype to prevent vuln.
        vmctx.a = 1;
        const jqa = new VM({
            timeout: 5
        }).run(ctx.query['conditions']);

        const items = await models[modelName].find(jqa || [], opts) || [];
        const count = await models[modelName].count(jqa || [], opts) || 0;

        ctx.body = items.map((it) => {
            return it.display();
        });

        //Set headers
        ctx.set('jollof-total-count', count);

        //} catch (err) {
        //    httpUtil.handleError(ctx, err);
        //}

    },

    //Get singular
    get: async function (ctx) {
        //try {
        const id = ctx.params.id;
        const modelName = ctx.params.modelName;
        const res = await models[modelName].findById(id);

        if (res)
            ctx.body = res.display();
        else {
            throw new Boom.notFound(`${modelName}:${id} not found`)
        }
        //} catch (err) {
        //    httpUtil.handleError(ctx, err);
        //}
    },

    /**
     * Create
     * The whole point of create is to Persist new data, regardless of whether or not it already has an Id.
     * @param modelName
     */
    create: async function (ctx) {
        //get schema
        //try {
        // console.log('body',ctx.request.body)    // if buffer or text
        // console.log('files',ctx.request.files)   // if multipart or urlencoded
        // console.log('fields',ctx.request.fields)
        const modelName = ctx.params.modelName;
        const payload = ctx.request.fields;


        delete payload['id'];

        const res = await models[modelName].persist(payload);

        ctx.body = res.display();
        //} catch (err) {
        //    httpUtil.handleError(ctx, err);
        //}
    },

    //Update
    update: async function (ctx) {
        //try {
        // console.log('body',ctx.request.body)    // if buffer or text
        // console.log('files',ctx.request.files)   // if multipart or urlencoded
        // console.log('fields',ctx.request.fields)
        const modelName = ctx.params.modelName;
        const payload = ctx.request.fields;

        const res = await models[modelName].persist(payload);
        ctx.body = res.display();
        //console.log(ctx.body);
        //} catch (err) {
        //    httpUtil.handleError(ctx, err);
        //}
    },

    //Delete or disable
    delete: async function (ctx) {
        //try {
        const id = ctx.params.id;
        const modelName = ctx.params.modelName;
        ctx.body = await models[modelName].removeById(id)
        //} catch (err) {
        //    httpUtil.handleError(ctx, err);
        //}
    },
}