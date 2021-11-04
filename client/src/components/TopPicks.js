import { React, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import moment from 'moment';
import './BookieHome.css';

import './Home.css';


  export default function TopPicks() {
    const {setClientAuth} = useAuth();
    const [topPicks, setTopPicks] = useState([]);

    var baseUrl = process.env.REACT_APP_ROUTE_URL;
    let result = [];

    const Market_Names = {"h2h": "Moneyline", "spreads": "Spread", "totals": "Total"};

    useEffect(() => {
    setClientAuth();
      axios({
        method: 'get',
        url: baseUrl + "/api/bets/week"
      })
      .then(res => {
        res.data.data.forEach(
          r => { 
              //if an array index by the value of id is not found, instantiate it. 
              if( !result[r.userEmail] ){  
                  //result gets a new index of the value at id. 
                  result[r.userEmail] = [];
              } 
              //push that whole object from res.data into that list 
              result[r.userEmail].push(r); 
          }   
        );
        setTopPicks(result);
      });
    }, []);

    return (
    <div className="app">
      <h1 className="title">Welcome to Bang Bets</h1>
      <h2 className="title">Top Picks This Week</h2>
      <div className="container">
        {Object.values(TopPicks).map((user_bets, i) => {
          return(
            <div className="card">
              <div className="user-email-container">
              <div className="user-email">{Object.keys(TopPicks)[i]}</div>
              <div className="num-bets">{user_bets.length} Bets</div>
              </div>
              <hr/>
              <div className="user-bets">
              {user_bets.map(user_bet => {
                return(
                  <div className="user-bet">
                    <div className="user-bet-type">
                        {user_bet.game.length === 1 && <div>Single Bet</div>}
                        {user_bet.game.length > 1 && <div>Parlay - ({user_bet.game.length} picks)</div>}
                        <div className="risk-win-bookie">Risk ${user_bet.betAmount} / Win ${user_bet.winAmount}</div>
                    </div>
                    <hr/>
                    <div className="bet-info">
                    {user_bet.game.map(user_bet_game=> {
                      return(
                        <div className="card-body-header">
                            <div className="bet-name">{user_bet_game.outcome.name}<span className="price">{user_bet_game.outcome.price > 0 && <span>+</span>}{user_bet_game.outcome.price}</span></div>
                            <div className="market-name">{Market_Names[user_bet_game.market.key]} <span>{user_bet_game.market.key === 'spreads' && user_bet_game.outcome.point > 0 && <span>+</span>}{user_bet_game.outcome.point}</span></div>
                            <div className="game-name">{user_bet_game.sport} - {user_bet_game.away_team} @ {user_bet_game.home_team}</div>
                            <div className="game-name">{moment(user_bet_game.commence_time).format('MMMM Do YYYY, h:mm a')}</div>
                        </div>
                      );
                    })}
                    </div>
                    <div className="bookie-footer">
                      <div className="bookie-timestamp">
                          <small>Placed: {moment(user_bet.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</small>
                      </div>
                    </div>
                  </div>
                )
              })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
    )
}