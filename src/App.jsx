import React, { Component } from 'react';
import './App.css'
import {FormGroup, FormControl, InputGroup, Glyphicon} from 'react-bootstrap'
import Profile from './Profile'
import Gallery from './Gallery'

class App extends Component {

	constructor(props){
		super(props);
		this.state = {
			query: '',
			artists: null,
			tracks: [],
			playlists: null,
			access_token: ''
		}
	}

	componentWillMount(){

		this.getParameterByName('access_token') !== null ? this.getToken(2) : this.getToken(1);
			
	}

	getParameterByName(name) {
	    const match = RegExp('[#&]' + name + '=([^&]*)').exec(window.location.hash);
	    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
	}

	getToken(action){

		switch(action){
		
		case 1:
			console.log(this.getParameterByName('access_token'))
			alert('Since May 29 of 2017 is necessary proven authorization from user to use Web API of Spotify. You will be redirected to do so.')
			const client_id = '9ad25b9292504311b9f8521a85c092a6';
			const response_type = 'token';
			const redirect_uri = 'http://localhost:3000/';
			const state = this.getCookie('CSRF-TOKEN');
			const URL = `https://accounts.spotify.com/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&
								response_type=${response_type}&state=${state}`;
			window.location = URL;
		break;
		case 2:
			this.setState({access_token: this.getParameterByName('access_token')})
		break;

		}
	}

	getCookie(name) {
	  if (!document.cookie) {
	    return null;
	  }

	  const xsrfCookies = document.cookie.split(';')
	    .map(c => c.trim())
	    .filter(c => c.startsWith(name + '='));

	  if (xsrfCookies.length === 0) {
	    return null;
	  }

	  return decodeURIComponent(xsrfCookies[0].split('=')[1]);
	}

	search(){

		const BASE_URL = 'https://api.spotify.com/v1/search'
	//let FETCH_URL = `${BASE_URL}?q=${this.state.query}&type=artist&limit=1`;
		let FETCH_URL = `${BASE_URL}?q=${this.state.query}&type=artist&limit=1&access_token=${this.state.access_token}`;
		const ALBUM_URL = 'https://api.spotify.com/v1/artists';
		const PLAYLIST_URL = 'https://api.spotify.com/v1/search'
		//console.log('FETCH_URL', FETCH_URL);
		fetch(FETCH_URL,{
			method: 'GET',
		}).then(response => response.json())
			.then(json => {
				const artists = json.artists.items[0];
				this.setState({artists});

				FETCH_URL = `${ALBUM_URL}/${artists.id}/top-tracks?country=US&access_token=${this.state.access_token}`
				//console.log('FETCH', FETCH_URL);
				fetch(FETCH_URL, {
					method: 'GET'
				})
				.then(response => response.json())
				.then(json => {
						//const tracks = json.tracks; 
						/*lo de abajo es otra forma de hacerlo,
						mas cool si el json trae muchos cambos y el 
						const tendra esos campos(parecido a lo de setState)*/
						const {tracks} = json;
						this.setState({tracks})
							}
					)

				FETCH_URL = PLAYLIST_URL + '?q="'+artists.name+'"&type=playlist&limit=5&access_token='+this.state.access_token;
				fetch(FETCH_URL, {
					method: 'GET'
				})
				.then(response => response.json())
				.then(json => {
					const {playlists} = json;
					this.setState({playlists})
					console.log('state', this.state);
					//console.log('PLAYLISTS',playlists.items);
				})
			});
	}


	render(){

		return(
			<div className="App">
				<div className="App-title"> Music Master</div>
				<FormGroup>
					<InputGroup>
						<FormControl
						type="text"
						placeholder="Search for an Artist"
						value={this.state.query}
						onChange={event => {this.setState({query: event.target.value})}}
						onKeyPress={event => {
							if (event.key ==='Enter') 
								this.search() 
											}
								 	}
						/>
						<InputGroup.Addon onClick={() => this.search()}>
							<Glyphicon glyph="search"></Glyphicon>
						</InputGroup.Addon>
					</InputGroup>
				</FormGroup>
				{
				this.state.artists !== null
				?
				<div>
					<Profile
						artist={this.state.artists}
						playlists={this.state.playlists}
					/>
					<Gallery
						tracks={this.state.tracks}
					/>
				</div>
				:
				<div></div>
				}
			
			</div>
		)
	}

}

export default App;