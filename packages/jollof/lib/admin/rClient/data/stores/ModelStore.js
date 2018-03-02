import axios from 'axios';
import {getState, storeState} from 'react-spoon';
/**
 * Created by iyobo on 2017-02-12.
 */
import {observable, action, extendObservable, toJS} from 'mobx';
import convertToFormData from '../../util/convertToFormData';

const defaultQuery = {
    paging: {
        page: 1,
        limit: 10
    },
    sort: { dateCreated: -1 },
    conditions: ''
};

class ModelStore {

    @observable models = [{ name: 'Loading' }];
    @observable modelHash = {};
    @observable active = {
        single: observable.map({}),
        totalItems: 0,
        totalPages: 0,
        table: [],
        model: {}
    };
    //@observable modelTable = [];
    //@observable modelSingle = {};

    @observable modelQuery = {
        paging: {
            page: 1,
            limit: 10
        },
        sort: { dateCreated: -1 },
        conditions: ''
    };

    //Store for the active Ref dialog
    @observable refActive = {
        totalItems: 0,
        totalPages: 0,
        table: [],
        model: {}
    };
    @observable refModelQuery = {
        paging: {
            page: 1,
            limit: 10
        },
        sort: { dateCreated: -1 },
        conditions: ''
    };

    @observable loadingCount = 0;


    reportError = (error) => {

        let msg = error.message;

        if (error.response && error.response.data && error.response.data.keyPath) {
            const data = error.response.data;
            msg = 'Invalid Input at <b>' + data.keyPath.join('.') + '</b>: ' + data.message;
            //console.error(msg);
        }else {
            msg = error.response.data;
            //console.error(error.response.data);
        }

        $.notify({
            icon: "pe-7s-attention",
            message: msg

        }, {
            type: 'danger',
            delay: 2000,
            placement: {
                from: 'top',
                align: 'right'
            }
        });
    }

    ////====== Table QUERY FILTER actions
    changeQueryConditions(str) {
        this.modelQuery.conditions = str;
        storeState(this.getStateKey(), this.modelQuery);
        console.log({real: str})
    }
    changeRefQueryConditions(str) {
        this.refModelQuery.conditions = str;
        console.log({ref: str})
    }

    reportSuccess = (msg) => {
        console.log(msg);

        $.notify({
            icon: "pe-7s-check",
            message: msg

        }, {
            type: 'success',
            delay: 2000,
            placement: {
                from: 'top',
                align: 'right'
            }
        });
    }

    fetchModels = () => {
        this.loadingCount++;
        return axios.get(apiPrefix+ '/api/v1/resource').catch((error) => {
            this.loadingCount--;
            this.reportError(error);
        }).then((res) => {
            this.loadingCount--;
            if (res) {
                const data = res.data;
                //run in action?
                this.models = data;

                //create a hash of resources mapped to their name
                this.modelHash = {};
                _.each(data, (it) => {
                    this.modelHash[it.name] = it;
                })

                return data;
            }
        });
    }

    fetchTable = () => {
        this.loadingCount++;

        //NOTE: If we are fetching tables, clean up old model data
        this.active.single.replace({});

        return axios.get(apiPrefix+ '/api/v1/resource/' + this.active.model.name, { params: this.modelQuery }).catch((error) => {
            this.loadingCount--;
            this.reportError(error);
        }).then((result) => {
            this.loadingCount--;
            if (result) {

                //console.log(result);

                this.active.totalItems = result.headers['jollof-total-count'];
                this.active.totalPages = Math.ceil(this.active.totalItems / this.modelQuery.paging.limit);

                this.active.table = result.data;

                //store the query of this load in the url for URL reproducability
                storeState(this.getStateKey(), this.modelQuery);

                //Now also store it in session Storage for navigational reproducability
                sessionStorage.setItem(this.active.model.name + '.list', window.location.href);

                return result.data;
            }


        });
    }

    fetchRefTable = () => {
        this.loadingCount++;

        //NOTE: If we are fetching tables, clean up old model data
        //this.activeRef.single.replace({});

        return axios.get(apiPrefix+ '/api/v1/resource/' + this.refActive.model.name, { params: this.refModelQuery }).catch((error) => {
            this.loadingCount--;
            this.reportError(error);
        }).then((result) => {
            this.loadingCount--;
            if (result) {

                //console.log(result);

                this.refActive.totalItems = result.headers['jollof-total-count'];
                this.refActive.totalPages = Math.ceil(this.refActive.totalItems / this.refModelQuery.paging.limit);

                this.refActive.table = result.data;

                return result.data;
            }


        });
    }

    fetchItem = (id, noSave) => {
        this.loadingCount++;

        return axios.get(apiPrefix+ '/api/v1/resource/' + this.active.model.name + '/' + id).catch((error) => {
            this.loadingCount--;
            this.reportError(error);
        }).then((result) => {
            this.loadingCount--;
            //run in action?
            //data.crono = null;
            if (result) {
                if(!noSave)
                    this.active.single.replace(result.data);

                //this.active.single.set('crono' ,new Date());

                return result.data;
            }
        });
    };

    fetchSpecificItem = (collectionName, id) => {
        this.loadingCount++;

        return axios.get(apiPrefix+ '/api/v1/resource/' + collectionName + '/' + id).catch((error) => {
            this.loadingCount--;
            this.reportError(error);
        }).then((result) => {
            this.loadingCount--;
            //run in action?
            //data.crono = null;
            if (result) {

                return result.data;
            }
        });
    };

    //----Update actions------

    saveActiveItem = (id) => {
        const activeData = toJS(this.active.single);
        console.log('Updating...', activeData);
        this.loadingCount++;

        //First convert to formdata
        const formData = convertToFormData(activeData);

        return axios.patch(apiPrefix+ '/api/v1/resource/' + this.active.model.name + '/' + id, formData, {}).catch((error) => {
            this.loadingCount--;
            this.reportError(error);
        }).then((res) => {
            this.loadingCount--;
            if (res) {
                this.reportSuccess(`${this.active.model.name}:<b>${id}</b> updated successfully!`);
                //success

                return res.data;
            }
        });
    }

    createActiveItem = () => {
        const activeData = toJS(this.active.single);
        console.log('Creating...', activeData);
        this.loadingCount++;

        //First convert to formdata
        const formData = convertToFormData(activeData);

        return axios.post(apiPrefix+ '/api/v1/resource/' + this.active.model.name, formData, {}).catch((error) => {
            this.loadingCount--;
            this.reportError(error);
        }).then((res) => {
            this.loadingCount--;

            if (res) {
                this.reportSuccess(`${this.active.model.name} created successfully!`);
                //success

                return res.data;
            }
        });
    }

    deleteItem = (id) => {

        return new Promise((resolve, reject) => {

            $.confirm({
                title: 'Are you Sure?',
                content: `Are you sure you want to <b>permanently delete </b> ${this.active.model.name}: <b>${id}</b>?`,
                buttons: {
                    yes: () => {
                        this.loadingCount++;

                        return axios.delete(apiPrefix+ '/api/v1/resource/' + this.active.model.name + '/' + id).catch((error) => {
                            this.loadingCount--;
                            this.reportError(error);

                            return reject();

                        }).then((res) => {
                            this.loadingCount--;
                            if (res) {
                                this.reportSuccess(`${this.active.model.name}:<b>${id}</b> Deleted successfully!`);
                                return resolve(res.data);
                            }
                            //run in action?
                            //return data;
                        });
                    },
                    no: () => {

                    },
                }
            });
        });
    }

    setActiveModel = (name) => {
        //console.log(this.modelHash)
        this.active.table = [];
        this.active.model = this.modelHash[name] || {};
    }

    setActiveRefModel = (name) => {
        //console.log(this.modelHash)
        this.refActive.table = [];
        this.refActive.model = this.modelHash[name] || {};
    }


    getStateKey() {
        //return 'models.'+this.active.model.name;
        return 'models';
    }

    /**
     * FIXME: this should not care about urlstate. use for now to build concept of storedState
     */
    resetQuery = () => {
        const queryKey = this.getStateKey();
        const urlstate = getState(queryKey) || defaultQuery;

        this.modelQuery = Object.assign({}, urlstate);
    }

    //=======PAGING
    incrementPage = () => {
        if (this.modelQuery.paging.page < this.active.totalPages)
            this.modelQuery.paging.page++;

        this.fetchTable()
    }

    decrementPage = () => {
        if (this.modelQuery.paging.page > 1)
            this.modelQuery.paging.page--;

        this.fetchTable();
    }
    incrementRefPage = () => {
        if (this.refModelQuery.paging.page < this.refActive.totalPages)
            this.refModelQuery.paging.page++;

        this.fetchRefTable()
    }

    decrementRefPage = () => {
        if (this.refModelQuery.paging.page > 1)
            this.refModelQuery.paging.page--;

        this.fetchRefTable();
    }


    //SORT
    sortTable(fieldName) {
        if (!this.modelQuery.sort[fieldName]) {
            this.modelQuery.sort = {};
            this.modelQuery.sort[fieldName] = 1;
        }

        this.modelQuery.sort[fieldName] = this.modelQuery.sort[fieldName] * -1;

        this.fetchTable();
    }
    sortRefTable(fieldName) {
        if (!this.refModelQuery.sort[fieldName]) {
            this.refModelQuery.sort = {};
            this.refModelQuery.sort[fieldName] = 1;
        }

        this.refModelQuery.sort[fieldName] = this.refModelQuery.sort[fieldName] * -1;

        this.fetchRefTable();
    }

    onFieldChange(observed, newValue) {
        observed = newValue;
    }

    clearFilters(){
        this.modelQuery.conditions = '';
        this.fetchTable();
    }
    clearRefFilters(){
        this.refModelQuery.conditions = '';
        this.fetchRefTable();
    }

}

export default new ModelStore();
