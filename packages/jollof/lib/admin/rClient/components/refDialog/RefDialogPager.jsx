/**
 * Created by iyobo on 2017-02-18.
 */
import React, {Component, PropTypes} from 'react';
import {inject, observer} from 'mobx-react';
const _ = require('lodash');

@inject('store')
@observer
export default class RefDialogPager extends Component {

    constructor() {
        super();

    }

    incrementPage = () => {

        this.props.store.models.incrementRefPage();
    }

    decrementPage = () => {

        this.props.store.models.decrementRefPage();
    }

    render() {
        return (
            <div className="pager pad-5">

                <nav aria-label="...">
                    <ul class="pager">
                        <li class={'previous ' + (this.props.store.models.refModelQuery.paging.page < 2 ? 'disabled' : '') }>
                            <span className="fakeLink" onClick={this.decrementPage}>
                                <span aria-hidden="true">&larr;</span> Previous
                            </span>
                        </li>
                        <li>
                            <span>
                            Page {this.props.store.models.refModelQuery.paging.page}
                                / { this.props.store.models.refActive.totalPages} : Total
                            Items: { this.props.store.models.refActive.totalItems}
                            </span>
                        </li>
                        <li class={"next " + (this.props.store.models.refModelQuery.paging.page >= this.props.store.models.refActive.totalPages ? 'disabled' : '')}>
                            <span className="fakeLink" onClick={this.incrementPage}>
                                Next <span aria-hidden="true">&rarr;</span>
                            </span>
                        </li>
                    </ul>
                </nav>

            </div>
        );
    }
}


