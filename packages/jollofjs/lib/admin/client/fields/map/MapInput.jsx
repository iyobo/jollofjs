import React, {PropTypes, Component} from 'react';
const uuid = require('uuid');
const _ = require('lodash');
import TextField from 'material-ui/TextField';

export class MapInput extends Component {
	componentWillMount() {
		// console.log('Map component on mount...', this.props);
		const key = uuid();

		this.state = {
			key: key,
			marker: null,
			mapId: 'map_' + key,
			searchId: 'search_' + key,
			map: null,
			values: this.props.input.value|| {}
		}
	}

	componentDidMount() {
		this.initMap();
	}

	initMap() {
		//First, find the long lat
		let lat = this.props.input.value.latitude ? this.props.input.value.latitude : 0;
		let lng = this.props.input.value.longitude ? this.props.input.value.longitude : 0;


		// Map
		var map = new google.maps.Map(document.getElementById(this.state.mapId), {
			zoom: 16,
			center: {lat: lat, lng: lng}
		});

		var marker = new google.maps.Marker({
			map: map,
			draggable: true,
			animation: google.maps.Animation.DROP,
			position: {lat: lat, lng: lng}
		});
		marker.addListener('dragend', this.onMarkerDragged.bind(this));

		// Searchbar
		var searchField = document.getElementById(this.state.searchId);

		var autocomplete = new google.maps.places.Autocomplete(
			searchField,
			{types: [ 'geocode' ]});

		// When the user selects an address from the dropdown, populate the address
		// fields in the form.
		autocomplete.addListener('place_changed', this.onSearchSelected.bind(this));
		google.maps.event.addDomListener(searchField, 'keydown', function ( e ) {
			if (e.keyCode == 13) {
				e.preventDefault();
			}
		});

		this.setState({...this.state, map, marker, autocomplete, searchField});
	}

	onSearchSelected() {
		var place = this.state.autocomplete.getPlace();

		// console.log('search selected', place);
		var lengthMap = {
			locality: 'short_name',
			administrative_area_level_1: 'long_name',
			country: 'long_name',
			postal_code: 'short_name'
		};

		var fieldMap = {
			locality: 'city',
			administrative_area_level_1: 'state',
			country: 'country',
			postal_code: 'postalCode'
		};

		let newInput = {}


		//Fields
		for (var i = 0; i < place.address_components.length; i++) {
			var addressType = place.address_components[ i ].types[ 0 ];
			if (lengthMap[ addressType ]) {
				var val = place.address_components[ i ][ lengthMap[ addressType ] ];
				newInput[ fieldMap[ addressType ] ] = val;
			}
		}

		//address
		newInput[ 'address' ] = place.name;

		//lat long
		newInput[ 'longitude' ] = place.geometry.location.lng();
		newInput[ 'latitude' ] = place.geometry.location.lat();

		//Change map and marker
		this.setGeo(place.geometry.location);

		//Clear search field
		this.state.searchField.value = '';

		//set full prior to save
		newInput[ 'full' ] = this.deduceFullAddressString(newInput);

		//Persist
		this.props.input.onChange(newInput);

	}

	setGeo( latlng ) {
		this.state.map.setCenter(latlng);
		this.state.marker.setPosition(latlng);
	}


	onMarkerDragged( evt ) {
		console.log('Marker dragged ', evt);
		const latlng = evt.latLng;
		this.state.map.setCenter(latlng);
		this.props.input.onChange({...this.props.input.value, latitude: latlng.lat(), longitude: latlng.lng()})

	}

	onTextChanged( name , evt, value) {

		//update field in value, and then update full.

		const values = {...this.props.input.value }
		values[name] = value

		//full
		values['full'] = this.deduceFullAddressString(values);


		this.props.input.onChange(values)

	}

	deduceFullAddressString(values){
		return `${values.address} ${values.address2}, ${values.city}, ${values.state} ${values.postalCode}, ${values.country}} `
	}


	render() {
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
							value={this.props.input.value.address}
							onChange={this.onTextChanged.bind(this, 'address')}
							floatingLabelText="Address"
							fullWidth={true}/>
						<TextField
							name='address2'
							value={this.props.input.value.address2}
							onChange={this.onTextChanged.bind(this, 'address2')}
							floatingLabelText="Apt / Unit"
							fullWidth={true}/>
						<TextField
							name='city'
							value={this.props.input.value.city}
							onChange={this.onTextChanged.bind(this, 'city')}
							floatingLabelText="City"
							fullWidth={true}/>
						<TextField
							name='state'
							value={this.props.input.value.state}
							onChange={this.onTextChanged.bind(this, 'state')}
							floatingLabelText="State"
							fullWidth={true}/>
						<TextField
							name='postalCode'
							value={this.props.input.value.postalCode}
							onChange={this.onTextChanged.bind(this, 'postalCode')}
							floatingLabelText="Postal Code"
							fullWidth={true}/>
						<TextField
							name='country'
							value={this.props.input.value.country}
							onChange={this.onTextChanged.bind(this, 'country')}
							floatingLabelText="Country"
							fullWidth={true}/>

					</div>
				</div>
			</div>
		);
	}
}

MapInput.propTypes = {
	input: PropTypes.object,
	label: PropTypes.string,
	onChange: PropTypes.func,
	source: PropTypes.string.isRequired,
};
