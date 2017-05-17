/**
 * Created by iyobo on 2017-02-12.
 */
import {observable, action} from 'mobx';
import models from './stores/ModelStore';



/**
 * Created by iyobo on 2017-02-12.
 */
class AppStore{

    @observable loadingCount = 0;
    @observable pageName = "";

    reportError = (error) => {
        //this.loadingCount--;
        //loadingCount = loadingCount < 0? 0: loadingCount;

        console.error(error);
        const data = error.response.data;

        if (data && data.keyPath) {

            const message = data.keyPath.join('.').toUpperCase() + ' ' + data.message;

            //notificationSpice.error(message);
            console.error(message);
            return data;
        } else {
            //notificationSpice.error(error.message);
            console.error(error.message);

        }
    }

    setPageName = (name) => {
        this.pageName = name;
    }

    changeModelPage(name) {
        models.resetQuery();
        models.setActiveModel(name);
        this.setPageName(name);
    }

}



export default {app: new AppStore(), models};