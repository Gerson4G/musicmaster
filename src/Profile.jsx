import React, { Component } from 'react';
import './App.css';

class Profile extends Component{

	render(){
		console.log('props',this.props)
		let artist={name: '', followers: {total: ''},
		 images: [{url: ''}], genres:[], playlists: [] };

		artist = this.props.artist !== null ? this.props.artist : artist;
		return(
			<div className="profile">
				<img
					alt="Profile"
					className="profile-img"
					src={artist.images[0].url}
				/>
				<div className="profile-info">
					<div className="profile-name"> {artist.name}</div>
					<div className="profile-followers"> {artist.followers.total} followers</div>
					<div className="profile-genres">
						{
							artist.genres.map( (genre,k) => {

								genre = genre !== artist.genres[artist.genres.length-1] ? ` ${genre}, ` :
										`& ${genre} `;
								return(
									<span key={k}> {genre} </span>
								)
							})
						}
					</div>
				</div>
				<div className="playlists">
				Playlists from {artist.name}
					{
						this.props.playlists !== null && this.props.playlists!== undefined
						?
						this.props.playlists.items.map( (playlist, index) =>{
							return(
							<div key={index}>
								<span> From {playlist.owner.id}</span>
								<a href={playlist.href}> Go to </a>
								<span> {playlist.tracks.total} songs</span>
							</div>
							)
						} )
						:
						<div></div>
						
					}
				</div>
			</div>
			)
	}

}

export default Profile;