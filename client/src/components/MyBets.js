import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import moment from 'moment';
import "./MyBets.css";
import { BsTrash } from 'react-icons/bs';

export default function MyBets() {

    const [betsArray, setBetsArray] = useState([]);
    const [noBets, setNoBets] = useState(false);
    const { currentUser } = useAuth();
    const [resSuccess, setResSuccess] = useState("");
    const [error, setError] = useState("");
    const [disabled, setDisabled] = useState(false);

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

    var baseUrl = process.env.REACT_APP_ROUTE_URL;

    function isGameLive(betToCheck) {
        var current_time = new Date();
        var soonestCommenceTime = new Date(2040, 0, 1);
        for (var i=0; i < betToCheck.game.length; i++) {
            console.log("current type: " + typeof( Date.parse(betToCheck.game[i].commence_time)));
            if (Date.parse(betToCheck.game[i].commence_time) < soonestCommenceTime) {
                soonestCommenceTime = Date.parse(betToCheck.game[i].commence_time);
            }
        }
        if (current_time > betToCheck) {
            setDisabled(true);
            return true;
        } else {
            return false;
        }
    }

    function deleteBet(betToDelete){
        if (!isGameLive(betToDelete)) {
            axios({
                method: 'delete',
                url: `${baseUrl}/api/bet/${betToDelete._id}`,
              })
              .then(res => {
                  setResSuccess("Bet was successfully cancelled");
                  var newBetsArray = betsArray.filter(bet => bet._id !== betToDelete._id);
                  if (newBetsArray.length === 0) { setNoBets(true);}
                  setBetsArray(newBetsArray);
              });
        } else {
            setError("Error - Cannot cancel live bet");
        }
    }

    function reverseArray(betsArray) {
        var reversedBetsArray = [];
        for (var i = betsArray.length-1; i >= 0; i--) {
            reversedBetsArray.push(betsArray[i]);
        }
        return reversedBetsArray;
    }

    function getAbbr(sport, team) {
        if (sport === "NFL") {
            return NFL_Teams[team];
        } else if (sport === "NBA") {
            return NBA_Teams[team];
        }
    }

    useEffect(() => {
          axios({
            method: 'get',
            url: baseUrl + "/api/bets/" + currentUser.uid
          })
          .then(res => {
            setBetsArray(res.data.data);
          });
      }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
    <div>
        { resSuccess && 
            <div style={{textAlign: 'center'}} className="alert alert-success success">{resSuccess}</div> }
        { error && 
            <div style={{textAlign: 'center'}} className="alert alert-error error">{error}</div> }
        <h1 className="title">My Bets</h1>
        {betsArray.length === 0 &&
            <div>
                <div style={{paddingTop: "30px"}}className="container">
                   <div className="card">
                        <div className="card-header">
                           <img className="no-bets-img" alt=""/>
                        </div>
                        <div className="no-bets-card-body">
                            You haven't placed any bets.
                            <br/><br/>
                            Click <strong>Place a Bet</strong> to get started.
                            <br/>
                            <br/>
                            <Link to="/football-bets" className="no-bets-btn">Place a Bet</Link>
                        </div>
                   </div>
                </div>
            </div>
        }
        <div className="bets-body">
            <div className="bet-cards">
            {reverseArray(betsArray).map(bet => {
                    return (
                        <div key={bet._id}>
                            <div className="container">
                                <div className="card">
                                    <div className="my-bets-type">
                                        {bet.game.length === 1 && <div>Single Bet</div>}
                                        {bet.game.length > 1 && <div>Parlay - ({bet.game.length} picks)</div>}
                                        <div className="risk-win">Risk ${bet.betAmount} / Win ${bet.winAmount}</div>
                                    </div>
                                    <div className="my-bet-list">
                                        {bet.game.map(game => {
                                            return (
                                                <div className="card-body-header">
                                                    <div className="bet-name">{game.outcome.name}<span className="price">{game.outcome.price > 0 && <span>+</span>}{game.outcome.price}</span></div>
                                                    <div className="market-name">{Market_Names[game.market.key]} <span>{game.market.key === 'spreads' && game.outcome.point > 0 && <span>+</span>}{game.outcome.point}</span></div>
                                                    <div className="game-name">{game.sport} - {getAbbr(game.sport, game.away_team)} @ {getAbbr(game.sport, game.home_team)}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="footer">
                                        <div className="timestamp">
                                            <small>Placed: {moment(bet.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</small>
                                        </div>
                                        <div className="btn-container">
                                            <button className="cancel-btn" disabled={disabled} onClick={() => {deleteBet(bet)}}>Cancel Bet</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
            </div>
        </div>
    </div>)
}