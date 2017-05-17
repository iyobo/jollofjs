/**
 * Created by iyobo on 2017-04-14.
 */
import React, {Component, PropTypes} from 'react';
import {rs} from 'react-spoon';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import TextField from 'material-ui/TextField';
const uuid = require('uuid');
const _ = require('lodash');


const emptyAddress = {
    address: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
}
const lengthMap = {
    locality: 'short_name',
    administrative_area_level_1: 'long_name',
    country: 'long_name',
    postal_code: 'short_name'
};

const fieldMap = {
    locality: 'city',
    administrative_area_level_1: 'state',
    country: 'country',
    postal_code: 'postalCode'
};

function deduceFullAddressString(values) {
    return `${values.address} ${values.address2 ? '#' + values.address2 : ''}, ${values.city}, ${values.state} ${values.postalCode}, ${values.country}`
}

@observer
export default class MapFieldInput extends Component {

    constructor() {
        super();
    }

    componentWillMount() {
        // console.log('Map component on mount...', this.props);
        const key = uuid();

        this.state = {
            key: key,
            marker: null,
            mapId: 'map_' + key,
            searchId: 'search_' + key,
            map: null,
            values: observable.map(this.props.data || {})
        }
    }

    componentDidMount() {

        this.initMap();
    }

    initMap = () => {
        const data = this.props.data || {};

        //First, find the long lat
        let lat = data.latitude ? data.latitude : 0;
        let lng = data.longitude ? data.longitude : 0;


        // Map
        var map = new google.maps.Map(document.getElementById(this.state.mapId), {
            zoom: 16,
            center: { lat: lat, lng: lng }
        });

        var marker = new google.maps.Marker({
            map: map,
            draggable: true,
            animation: google.maps.Animation.DROP,
            position: { lat: lat, lng: lng }
        });
        marker.addListener('dragend', this.onMarkerDragged.bind(this));

        // Searchbar
        var searchField = document.getElementById(this.state.searchId);

        var autocomplete = new google.maps.places.Autocomplete(
            searchField,
            { types: ['geocode'] });

        // When the user selects an address from the dropdown, populate the address
        // fields in the form.
        autocomplete.addListener('place_changed', this.onSearchSelected.bind(this));
        google.maps.event.addDomListener(searchField, 'keydown', function (e) {
            if (e.keyCode == 13) {
                e.preventDefault();
            }
        });

        this.setState({ ...this.state, map, marker, autocomplete, searchField });
    }

    onSearchSelected = () => {
        var place = this.state.autocomplete.getPlace();

        // console.log('search selected', place);


        let newInput = { ...emptyAddress }


        //Fields
        for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            if (lengthMap[addressType]) {
                var val = place.address_components[i][lengthMap[addressType]];
                newInput[fieldMap[addressType]] = val;
            }
        }

        //address
        newInput['address'] = place.name;

        //lat long
        newInput['longitude'] = place.geometry.location.lng();
        newInput['latitude'] = place.geometry.location.lat();

        //Change map and marker
        this.setGeo(place.geometry.location);

        //Clear search field
        this.state.searchField.value = '';

        //set full prior to save
        newInput['full'] = deduceFullAddressString(newInput);

        //Persist
        this.props.onChange(newInput);

    }

    setGeo = (latlng) => {
        this.state.map.setCenter(latlng);
        this.state.marker.setPosition(latlng);
    }


    onMarkerDragged = (evt) => {
        // console.log('Marker dragged ', evt);
        const latlng = evt.latLng;
        this.state.map.setCenter(latlng);
        this.props.onChange({ ...this.props.data, latitude: latlng.lat(), longitude: latlng.lng() })

    }

    onTextChanged = (name, evt, value) => {

        //update field in value, and then update full.

        const values = { ...this.props.data }
        values[name] = value

        //full
        values['full'] = deduceFullAddressString(values);


        this.props.onChange(values)

    }


    ////////////

    handleChange = (valueMap) => {
        this.props.onChange(valueMap)
    }

    render() {

        const data = this.props.data || {}

        return (
            <div >
                <div className="row">
                    <div className="col-md-12 col-sm-12">
                        <TextField
                            id={this.state.searchId}
                            placeholder="Search for a place..."
                            fullWidth={true}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 col-sm-12 ">
                        <div key={this.state.key} id={this.state.mapId} className="jollofMap">loading map...</div>
                    </div>
                    <div className="col-md-6 col-sm-12 ">
                        <TextField
                            name='address'
                            value={data.address}
                            onChange={this.onTextChanged.bind(this, 'address')}
                            floatingLabelText="Address"
                            fullWidth={true}/>
                        <TextField
                            name='address2'
                            value={data.address2}
                            onChange={this.onTextChanged.bind(this, 'address2')}
                            floatingLabelText="Apt / Unit"
                            fullWidth={true}/>
                        <TextField
                            name='city'
                            value={data.city}
                            onChange={this.onTextChanged.bind(this, 'city')}
                            floatingLabelText="City"
                            fullWidth={true}/>
                        <TextField
                            name='state'
                            value={data.state}
                            onChange={this.onTextChanged.bind(this, 'state')}
                            floatingLabelText="State"
                            fullWidth={true}/>
                        <TextField
                            name='postalCode'
                            value={data.postalCode}
                            onChange={this.onTextChanged.bind(this, 'postalCode')}
                            floatingLabelText="Postal Code"
                            fullWidth={true}/>
                        <TextField
                            name='country'
                            value={data.country}
                            onChange={this.onTextChanged.bind(this, 'country')}
                            floatingLabelText="Country"
                            fullWidth={true}/>

                    </div>
                </div>
            </div>

        );
    }
}


