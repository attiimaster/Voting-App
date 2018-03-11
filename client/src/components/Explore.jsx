import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Explore.css';

class Explore extends Component {
	constructor() {
		super();
		this.state = {
			polls: [[], []],
		}
	}

  	componentWillMount() {
      	fetch('/explore/') //
        	.then(res => res.json())
        	.then(polls => this.setState({polls}, () => console.log('Polls fetched...', polls)));
  	}

	render() {
		const Polls = props => {
			console.log("this.props.index: " + props.index)

			return (
				<div className="split">
					<h3 className=""><i className={props.cL}></i> {props.title}</h3>
					{this.state.polls[props.index].map(polls => 
            	  		<Link to={"./poll/" + polls._id}>
            	  			<div className="search-results-box">
            	    			<div className="search-results-question">{polls.question} 
            	      				<div className="search-results-votes">{polls.votes.reduce((pv, cv) => pv+cv, 0)}</div>
            	    			</div>
            	    			<div className="search-results-creator">Asked by {polls.creator.split(" ")[0]}</div>
            	  			</div>
            	  		</Link>
            		)}
            	</div>
			)
		}
		return(
			<div className="container">
				<h1 className="">Explore</h1>
				<div className="polls">
	
				<Polls index={0} title={"hot right now"} cL={"fas fa-fire"} />
				<Polls index={1} title={"recently asked"} cL={"far fa-clock"} />

				</div>
			</div>
			);
	}
}

export default Explore;