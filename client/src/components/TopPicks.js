import { React, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import moment from 'moment';
import './BookieHome.css';
import './TopPicks.css';
import './Home.css';

  export default function TopPicks() {
    const {setClientAuth} = useAuth();
    const [topPicks, setTopPicks] = useState([]);

    var baseUrl = process.env.REACT_APP_ROUTE_URL;

    const Market_Names = {"h2h": "Moneyline", "spreads": "Spread", "totals": "Total"};

    function containsObject(obj, list) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].betId === obj.betId) {
                return true;
            }
        }
        return false;
    }

    function getMostCommonBets(activeBetList) {
        var result = [];
        var hash = new Map();
        activeBetList.map(bet => {
            bet.game.map((game) => {
                if (hash.has(game.betId + "_" + game.outcome.name)) {
                    hash.set(game.betId + "_" + game.outcome.name, hash.get(game.betId + "_" + game.outcome.name) + 1);
                } else {
                    hash.set(game.betId + "_" + game.outcome.name, 1);
                }
            });
        });
        hash.forEach((value,key) => {
            var res = -1;
            console.log(key + " " + value)
            var top_game = {};
            if (value > 1) {
                res = key;
                activeBetList.map(bet => {
                    top_game = bet.game.find(game => game.betId + "_" + game.outcome.name === res);
                    if (top_game && !containsObject(top_game, result)) {
                        result.push(top_game);
                    }
                });
            }
        });
        console.log(activeBetList)
        if (result.length !== 0) {
            setTopPicks(result);
        } else {
            var noTopPicksResult = [];
            activeBetList.map(bet => {
                bet.game.map(game => {
                    noTopPicksResult.push(game);
                });
            });
            setTopPicks(noTopPicksResult);
        }
        
    }

    useEffect(() => {
      setClientAuth();
      axios({
        method: 'get',
        url: baseUrl + "/api/bets/active"
      })
      .then(res => {
          if (res.data.data.length !== 0){
            getMostCommonBets(res.data.data);
          } else {
            setTopPicks(null);
          }
      });
    }, []);

    return (
    <div className="app">
      <h1 className="top-picks-title">Welcome to Bang Bets</h1>
      <h2 className="title">Top Picks this Week</h2>
      <div className="top-picks-container">
          {console.log(topPicks)}
        {topPicks.map((bet, i) => {
            console.log("wtf")
            return(
                <div>
                <hr/>
                <div className="bet-info">
                    <div className="card-body-header">
                        <div className="bet-name">{bet.outcome.name}<span className="price">{bet.outcome.price > 0 && <span>+</span>}{bet.outcome.price}</span></div>
                        <div className="market-name">{Market_Names[bet.market.key]} <span>{bet.market.key === 'spreads' && bet.outcome.point > 0 && <span>+</span>}{bet.outcome.point}</span></div>
                        <div className="game-name">{bet.sport} - {bet.away_team} @ {bet.home_team}</div>
                        <div className="game-name">{moment(bet.commence_time).format('MMMM Do YYYY, h:mm a')}</div>
                    </div>
                </div>
                </div>
            )
        })}
      </div>
    </div>
    )
}