import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import moment from 'moment';
import "./MyBets.css";
import { FaFileInvoiceDollar } from 'react-icons/fa';
import { MdTimer } from 'react-icons/md';


export default function MyBets() {

    const [betsArray, setBetsArray] = useState([]);
    const { currentUser } = useAuth();
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    // const [deleted, setDeleted] = useState(false);
    const [transition, setTransition] = useState("");

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

    // function isGameLive(betToCheck) {
    //     var current_time = new Date();
    //     var soonestCommenceTime = new Date(2040, 0, 1);
    //     for (var i=0; i < betToCheck.game.length; i++) {
    //         if (Date.parse(betToCheck.game[i].commence_time) < soonestCommenceTime) {
    //             soonestCommenceTime = Date.parse(betToCheck.game[i].commence_time);
    //         }
    //     }
    //     if (current_time > soonestCommenceTime) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }

    // function deleteBet(betToDelete){
    //     setDeleted(false);
    //     if (!isGameLive(betToDelete)) {
    //         axios({
    //             method: 'delete',
    //             url: `${baseUrl}/api/bet/${betToDelete._id}`,
    //           })
    //           .then(res => {
    //               setSuccess("Bet was successfully cancelled");
    //               setDeleted(true);
    //               var newBetsArray = betsArray.slice();
    //               var index = newBetsArray.indexOf(betToDelete);
    //               newBetsArray.splice(index, 1);
    //               setBetsArray(newBetsArray);
    //           });
    //     } else {
    //         setError("Cannot cancel live bet");
    //     }
    // }

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

      useEffect(() => {
        if (success !== "") {
            setTransition(true);
            setTimeout(() => {
                setTransition(false);
                setSuccess("");
            }, 2000);
        }
    }, [success]);

    useEffect(() => {
        if (error !== "") {
            setTransition(true);
            setTimeout(() => {
                setTransition(false);
                setError("");
            }, 2000);
        }
    }, [error]);

    return (
    <div>
        <div variant="success" className = {`success ${transition ? 'show' : 'hide'}`}>{success}</div>
            <div variant="danger" className = {`error ${transition ? 'show' : 'hide'}`}>{error}</div>
        <h1 className="title">My Bets</h1>
        {betsArray.length === 0 &&
            <div>
                <div style={{paddingTop: "30px"}}className="container">
                   <div className="card">
                        <div className="card-header no-bets-icon">
                           <FaFileInvoiceDollar size={150}/>
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
                                        <div className="bet-header">
                                            {bet.game.length === 1 && <div>Single Bet</div>}
                                            {bet.game.length > 1 && <div>Parlay - ({bet.game.length} picks)</div>}
                                            <div className="risk-win">Risk ${bet.betAmount} / Win ${bet.winAmount}</div>
                                        </div>
                                        <div className="bet-result">
                                            {bet.result==="in progress" && <div><MdTimer size={30}/></div>}
                                            {bet.result==="win" && <div className="win">W</div>}
                                            {bet.result==="loss" && <div className="loss">L</div>}
                                        </div>
                                    </div>
                                    
                                    <div className="my-bet-list">
                                        {bet.game.map(game => {
                                            return (
                                                <div key={game.betId} className="card-body-header">
                                                    <div className="bet-name">{game.outcome.name}<span className="price">{game.outcome.price > 0 && <span>+</span>}{game.outcome.price}</span></div>
                                                    <div className="market-name">{Market_Names[game.market.key]} <span>{game.market.key === 'spreads' && game.outcome.point > 0 && <span>+</span>}{game.outcome.point}</span></div>
                                                    <div className="game-name">{game.sport} - {getAbbr(game.sport, game.away_team)} @ {getAbbr(game.sport, game.home_team)}</div>
                                                    <div className="game-name">{moment(game.commence_time).format('MMMM Do YYYY, h:mm a')}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="footer">
                                        {(bet.status) && <div className="client-paid-out">Paid Out</div>}
                                        <div className="timestamp">
                                            <small>Placed: {moment(bet.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</small>
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