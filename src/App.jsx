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
			playlists: null
		}
	}

	search(){

		const BASE_URL = 'https://api.spotify.com/v1/search'
		let FETCH_URL = `${BASE_URL}?q=${this.state.query}&type=artist&limit=1`;
		const ALBUM_URL = 'https://api.spotify.com/v1/artists';
		const PLAYLIST_URL = 'https://api.spotify.com/v1/search'
		//console.log('FETCH_URL', FETCH_URL);
		fetch(FETCH_URL,{
			method: 'GET'
		}).then(response => response.json())
			.then(json => {
				const artists = json.artists.items[0];
				this.setState({artists});

				FETCH_URL = `${ALBUM_URL}/${artists.id}/top-tracks?country=US&`
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

				FETCH_URL = PLAYLIST_URL + '?q="'+artists.name+'"&type=playlist&limit=5'
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