import { React, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import moment from 'moment';
import './BookieHome.css';

import './Home.css';

  export default function BookieActiveBets() {
    const [betsByUserEmail, setBetsByUserEmail] = useState([]);
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
      setBookieAuth();
      axios({
        method: 'get',
        url: baseUrl + "/api/bets/active"
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
    }, []);

    function areGamesOver(betToCheck) {
      var current_time = new Date();
      var latest_commence_time = new Date(0);
      
      for (var i=0; i < betToCheck.game.length; i++) {
        var commence_time = new Date(betToCheck.game[i].commence_time);
          if (commence_time > latest_commence_time) {
              latest_commence_time = commence_time;
          }
      }
      // has it been 4 hours since the latest game in bet started
      if (current_time > moment(latest_commence_time).add(4, 'h').toDate()) {
          return true;
      } else {
          return false;
      }
  }

  function calculateResults(betToCheck, results) {
    var result = "in progress";
    var team1 = {"name": results.teams[0].name, "score": parseInt(results.teams[0].score.total)};
    var team2 = {"name": results.teams[1].name, "score": parseInt(results.teams[1].score.total)};
    betToCheck.game.map(game => {
      if (result === "in progress" || result === "win") {
        if (game.market.key === 'h2h') {
          if (team1.name === game.outcome.name) {
            if (team1.score > team2.score) {
              result = "win";
            } else {
              result = "loss";
            }
          } else if (team2.name === game.outcome.name) {
            if (team2.score > team1.score) {
              result = "win";
            } else {
              result = "loss";
            }
          }
        } else if (game.market.key === 'spreads') {
          if (team1.name === game.outcome.name) {
            if (game.outcome.point > 0) {
              if (team1.score + game.outcome.point > team2.score) {
                result = "win";
              } else {
                result = "loss";
              }
            } else if (game.outcome.point < 0) {
              if (team1.score - Math.abs(game.outcome.point) > team2.score) {
                result = "win";
              } else {
                result = "loss";
              }
            }
          } else if (team2.name === game.outcome.name) {
            if (game.outcome.point > 0) {
              if (team2.score + game.outcome.point > team1.score) {
                result = "win";
              } else {
                result = "loss";
              }
            } else if (game.outcome.point < 0) {
              if (team2.score - Math.abs(game.outcome.point) > team1.score) {
                result = "win";
              } else {
                result = "loss";
              }
            }
          }
        } else if (game.market.key === 'totals') {
          var total = team1.score + team2.score;
          if (game.outcome.name === "Over") {
            if (total > game.outcome.point) {
              result = "win";
            } else {
              result = "loss";
            }
          } else if (game.outcome.name === "Under") {
            if (total < game.outcome.point) {
              result = "win";
            } else {
              result = "loss";
            }
          }
        }
      }
    });
    // Update bet result
      axios({
        method: 'put',
        url: baseUrl + "/api/result/" + betToCheck._id + "/" + result
      }).then(res => {
        console.log(res);
      });
  }

  function checkResults(betToCheck) {
    if (areGamesOver(betToCheck)) {
      //call API
      betToCheck.game.map(game => {
        // var momentDate = moment(game.commence_time).format('llll').toString();
        // var start_time = momentDate.substring(0, 10);
        axios({
          method: 'get',
          url: baseUrl + "/api/check-results/" + game.home_team
        }).then(res => {
          // calculate bet results based on res.data
          calculateResults(betToCheck, res.data.results);
        });
      });
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
      <h1 className="title">Active Client Bets</h1>
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
                  <div key={user_bet._id} className="user-bet">
                    <div className="user-bet-type">
                        {user_bet.game.length === 1 && <div>Single Bet</div>}
                        {user_bet.game.length > 1 && <div>Parlay - ({user_bet.game.length} picks)</div>}
                        <div className="risk-win-bookie">Risk ${user_bet.betAmount} / Win ${user_bet.winAmount}</div>
                        <div className="bookie-bet-result">
                            {user_bet.result==="in progress" && <div className="in-progress">In Progress</div>}
                            {user_bet.result==="win" && <div className="win">Win</div>}
                            {user_bet.result==="loss" && <div className="loss">Loss</div>}
                        </div>
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