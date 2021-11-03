import { React, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import moment from 'moment';
import './BookieHome.css';

import './Home.css';


  export default function BookieAllBets() {
    const [betsByUserEmail, setBetsByUserEmail] = useState([]);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [isPaid, setIsPaid] = useState(false);
    const [transition, setTransition] = useState(false);
    const {setBookieAuth} = useAuth();

    var baseUrl = process.env.REACT_APP_ROUTE_URL;
    let result = [];

    const Market_Names = {"h2h": "Moneyline", "spreads": "Spread", "totals": "Total"};
    const NFL_Teams = {"Arizona Cardinals":"ARI", "Atlanta Falcons":"ATL", "Baltimore Ravens":"BAL",
    "Buffalo Bills":"BUF", "Carolina Panthers":"CAR", "Dallas Cowboys":"DAL",
    "Cincinnati Bengals":"CIN", "Cleveland Browns":"CLE", "Chicago Bears":"CHI",
    "Denver Broncos":"DEN", "Detroit Lions":"DET", "Green Bay Packers":"GB",
    "Houston Texans":"HOU", "Indianapolis Colts":"IND", "Jacksonville Jaguars":"JAX",
    "Kansas City Chiefs":"KC", "Miami Dolphins":"MIA", "Minnesota Vikings":"MIN",
    "New England Patriots":"NE", "New Orleans Saints":"NO", "New York Giants":"NYG",
    "New York Jets": "NYJ", "Las Vegas Raiders":"LV", "Philadelphia Eagles":"PHI",
    "Pittsburgh Steelers":"PIT", "Los Angeles Chargers":"LAC", "San Francisco 49ers":"SF",
    "Seattle Seahawks":"SEA", "Los Angeles Rams":"LAR", "Tampa Bay Buccaneers":"TB",
    "Tennessee Titans":"TEN", "Washington Football Team":"WAS"
    };

    const MLB_Teams = {"Arizona Diamondbacks": "ARI",	"Atlanta Braves":	"ATL", "Baltimore Orioles": "BAL",
    "Boston Red Sox":	"BOS", "Chicago White Sox": "CWS", "Chicago Cubs":	"CHC",
    "Cincinnati Reds":	"CIN", "Cleveland Indians": "CLE", "Colorado Rockies":	"COL",
    "Detroit Tigers":	"DET", "Houston Astros":	"HOU", "Kansas City Royals":	"KC",
    "Los Angeles Angels":	"ANA", "Los Angeles Dodgers": "LAD", "Miami Marlins": "MIA",
    "Milwaukee Brewers": "MIL", "Minnesota Twins": "MIN", "New York Mets": "NYM",
    "New York Yankees":	"NYY", "Oakland Athletics": "OAK", "Philadelphia Phillies": "PHI",	
    "Pittsburgh Pirates":	"PIT", "San Diego Padres":	"SD", "San Francisco Giants":	"SF",
    "Seattle Mariners":	"SEA", "St. Louis Cardinals": "STL", "Tampa Bay Rays":	"TB",
    "Texas Rangers": "TEX", "Toronto Blue Jays": "TOR", "Washington Nationals":	"WAS"
    }

    const NBA_Teams = {"Boston Celtics": "BOS", "Brooklyn Nets": "BKN", "New York Knicks": "NY",
    "Philadelphia 76ers": "PHI", "Toronto Raptors": "TOR", "Golden State Warriors": "GS",    
    "Los Angeles Clippers": "LAC", "Los Angeles Lakers": "LAL", "Phoenix Suns": "PHX",
    "Sacramento Kings": "SAC", "Chicago Bulls": "CHI", "Cleveland Cavaliers": "CLE",
    "Detroit Pistons": "DET", "Indiana Pacers": "IND", "Milwaukee Bucks": "MIL",
    "Dallas Mavericks": "DAL", "Houston Rockets": "HOU", "Memphis Grizzlies": "MEM",
    "New Orleans Pelicans": "NO", "San Antonio Spurs": "SA", "Atlanta Hawks": "ATL",
    "Charlotte Hornets": "CHA", "Miami Heat": "MIA", "Orlando Magic": "ORL",
    "Washington Wizards": "WSH", "Denver Nuggets": "DEN", "Minnesota Timberwolves": "MIN",
    "Oklahoma City Thunder": "OKC", "Portland Trail Blazers": "POR", "Utah Jazz": "UTA"
  }

    useEffect(() => {
      axios({
        method: 'get',
        url: baseUrl + "/api/bets/"
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
        setBetsByUserEmail(result);
      });
    }, [isPaid]);

    function updatePayoutStatus(id) {
      axios({
        method: 'put',
        url: baseUrl + "/api/bet/" + id
      }).then(res => {
        setTransition(true);
        setIsPaid(true);
        setTimeout(() => {
            setTransition(false);
            setSuccess("");
        }, 3000);
        setSuccess(res.data.message);
      }).catch(res => {
        setTransition(true);
        setTimeout(() => {
            setTransition(false);
            setError("");
        }, 3000);
        setError(res.data.message);
      });
    }

    function areGamesOver(betToCheck) {
      var current_time = new Date();
      var latestCommenceTime = new Date(2040, 0, 1);
      for (var i=0; i < betToCheck.game.length; i++) {
          if (Date.parse(betToCheck.game[i].commence_time) > latestCommenceTime) {
              latestCommenceTime = Date.parse(betToCheck.game[i].commence_time);
          }
      }
      // has it been 4 hours since the latest game in bet started
      if (current_time > moment(latestCommenceTime).add(4, 'h').toDate()) {
          return true;
      } else {
          return false;
      }
  }

  function checkResults(betToCheck) {
    if (areGamesOver(betToCheck)) {
      //call API
      console.log("game over");
    } else {
      console.log("game not over");
    }
  }

    function getAbbr(sport, team) {
      if (sport === "NFL") {
          return NFL_Teams[team];
      } else if (sport === "NBA") {
          return NBA_Teams[team];
      } else if (sport === "MLB") {
          return MLB_Teams[team];
      }
  }

    return (
    <div className="app">
      <div variant="success" className = {`success ${transition ? 'show' : 'hide'}`}>{success}</div>
      <div variant="danger" className = {`error ${transition ? 'show' : 'hide'}`}>{error}</div>
      <h1 className="title">All Client Bets</h1>
      <div className="container">
        {Object.values(betsByUserEmail).map((user_bets, i) => {
          return(
            <div className="card">
              <div className="user-email-container">
              <div className="user-email">{Object.keys(betsByUserEmail)[i]}</div>
              <div className="num-bets">{user_bets.length} Bets</div>
              </div>
              <hr/>
              <div className="user-bets">
              {user_bets.map(user_bet => {
                checkResults(user_bet);
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
                            <div className="game-name">{user_bet_game.sport} - {getAbbr(user_bet_game.sport, user_bet_game.away_team)} @ {getAbbr(user_bet_game.sport, user_bet_game.home_team)}</div>
                            <div className="game-name">{moment(user_bet_game.commence_time).format('MMMM Do YYYY, h:mm a')}</div>
                        </div>
                      );
                    })}
                    </div>
                    <div className="bookie-footer">
                      <div className="bookie-timestamp">
                          <small>Placed: {moment(user_bet.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</small>
                      </div>
                      {console.log(user_bet.status)}
                      <div className="payout-button-container">
                        {(!user_bet.status) && <button className="payout-button" onClick = {() => updatePayoutStatus(user_bet._id)}>Mark as Paid Out</button>}
                        {(user_bet.status) && <div className="paid-out">Paid Out</div>}
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