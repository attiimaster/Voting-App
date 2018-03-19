import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './MyPolls.css';

class MyPolls extends Component {
  constructor() {
    super();
    this.state = {
      mypolls: []
    };
    this.handleDelete = this.handleDelete.bind(this)
  }

  componentWillMount() {
    if(this.props.authData.fbId) {
      fetch('https://youvote-api.glitch.me/mypolls/' + this.props.authData.fbId) //
        .then(res => res.json())
        .then(mypolls => this.setState({mypolls}, () => console.log('My polls fetched...', mypolls)));
    }  
  }

  componentWillReceiveProps(nextProps) {  //fixes not rendering polls on refresh
    if(this.props.authData !== nextProps.authData) {
      fetch('/mypolls/' + nextProps.authData.fbId) //
        .then(res => res.json())
        .then(mypolls => this.setState({mypolls}, () => console.log('My polls fetched...', mypolls)));
    }       
  }


  handleDelete(event) {
    event.preventDefault()
    if (window.confirm("Are you sure you want to delete this poll?")) {
      let pollId = event.target.parentElement.parentElement.attributes.href.nodeValue.slice(7)
  
      for(let i=0;i<this.state.mypolls.length;i++) {  //to remove poll from state
        if(this.state.mypolls[i]._id === pollId && this.props.authData.isAuth && this.props.authData.fbId === this.state.mypolls[i].fbId) {    //find poll in state
          let arr = this.state.mypolls
          arr.splice(i, 1)
          this.setState(arr)                          //set new state
  
          fetch('https://youvote-api.glitch.me/delete', {                          //remove poll from db
            method: 'POST',
            headers: {
              'Access-Control-Allow-Origin': 'https://youvote-api.glitch.me',
              'Access-Control-Allow-Methods': 'GET, POST',
              'Content-Type': 'application/json',
            },
            mode: 'cors',
            body: JSON.stringify({pollId: pollId})
          })        
        }// else alert("Error! You do not seem to be the creator of this poll!")
      }      
    } 
    
  }
    
  render() {
    const polls = this.state.mypolls.map((mypolls, i) => //check key
          <Link to={"./poll/" + mypolls._id} key={i}>
            <div className="search-results-box">
              <div className="search-results-question">{mypolls.question} 
                <div className="search-results-votes">{mypolls.votes.reduce((pv, cv) => pv+cv, 0)}</div>
              </div>
              <div className="search-results-creator">Asked by {mypolls.creator.split(" ")[0]}</div>
              <button className="delete2" onClick={this.handleDelete} key={mypolls.id}>X</button>
            </div>
          </Link>
        )

    {if(!this.props.authData.isAuth) {
      return (<h1 className="container">You need to be logged in to view this page!</h1>)
    }}

    return (
      <div className="container">
        <h1>My Polls</h1>

        <div className="polls">
          {polls}
        </div>
        
        <Link to="/new" className="btn">New Poll</Link>
      </div>
    );
  }
}

export default MyPolls;
