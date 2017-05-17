/**
 * Created by iyobo on 2017-02-18.
 */
import React, {Component, PropTypes} from 'react';
import {inject, observer} from 'mobx-react';
const _ = require('lodash');

@inject('store')
@observer
export default class ListPagePager extends Component {

    constructor() {
        super();

    }

    incrementPage = () => {

        this.props.store.models.incrementPage();
    }

    decrementPage = () => {

        this.props.store.models.decrementPage();
    }

    render() {
        return (
            <div className="pager pad-5">

                <nav aria-label="...">
                    <ul class="pager">
                        <li class={'previous ' + (this.props.store.models.modelQuery.paging.page < 2 ? 'disabled' : '') }>
                            <span className="fakeLink" onClick={this.decrementPage}>
                                <span aria-hidden="true">&larr;</span> Previous
                            </span>
                        </li>
                        <li>
                            <span>
                            Page {this.props.store.models.modelQuery.paging.page}
                                / { this.props.store.models.active.totalPages} : Total
                            Items: { this.props.store.models.active.totalItems}
                            </span>
                        </li>
                        <li class={"next " + (this.props.store.models.modelQuery.paging.page >= this.props.store.models.active.totalPages ? 'disabled' : '')}>
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


