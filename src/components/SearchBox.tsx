import React, { useState } from "react";
import './searchbox.scss';

const SearchBox= (props : any)=>{

    return (
    <div className="film-search">
            <div className="search-box">
                
                <input
                    className="search-input"
                    type="text"
                    name="film-name"
                    placeholder="&#x1F50E;&#xFE0E; Search"
                    onChange={props.handleSearch}
                />
                <ul className="film-list" style={props.listStyle}>   
                {props.movieList? props.movieList.map((movie: any)=>{
                    return <li>
                        <div className="movie-item" key={movie['id']} onClick={()=>{props.onFilmClick(movie['attributes']['files'][0]['file_id'])}}>
                            <img 
                            src={movie['attributes']['related_links'][0]['img_url']}
                            alt="movie icon"
                            height={80}
                            width={55}
                            />
                            <div className="film-details">
                                <div className="film-name">
                            {movie['attributes']['feature_details']['title']}
                                </div>
                                <div className="film-year">
                            {movie['attributes']['feature_details']['year']}
                                </div>
                            </div>
                        </div>
                        </li>
                }):'no films'}
                </ul>
                
            </div>

        </div>
    );
};

export default SearchBox;