import { React, useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import axios from 'axios';

import './Bets.css';
import ActiveBets from './ActiveBets';


  export default function BasketballBets() {

    const [basketballBets, setBasketballBets] = useState([]);
    const [activeBets, setActiveBets] = useState([]);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    var activeBetsArray = [];

    var baseOddsUrl = process.env.REACT_APP_ODDS_URL;

    useEffect(() => {
        axios({
            method: 'get',
            url: baseOddsUrl + `/v4/sports/basketball_nba/odds/?apiKey=${process.env.REACT_APP_ODDS_API_KEY}&regions=us&markets=h2h,spreads,totals&oddsFormat=american`,
          })
          .then(res => {
            // Set arrays
            setBasketballBets(res.data);
          });
    }, []);

    function addBet(bet) {
        if (!activeBets.includes(bet)) {
            activeBetsArray = activeBets.concat(bet);
            setActiveBets(activeBetsArray);
        }
    }

    function deleteBet(bet) {
        var array = activeBets.slice();
        var index = array.indexOf(bet);
        array.splice(index, 1);
        setActiveBets(array);
    }

    function getSportsBook(booksArray) {
        // Looking for barstool
        for (var i=0; i < booksArray.length; i++) {
            if (booksArray[i].key === "barstool") {
                return booksArray[i];
            }
        }
    }

    return (
        <div className="bet-container">
            {success !== "" && <Alert variant="success" className="success">{success}</Alert>}
            {error !=="" && <Alert variant="danger" className="error">{error}</Alert>}
            <div className="row title-container">
                <div className="col col-container-teams">
                    <div className="box-teams">Game</div>
                </div>
                <div className="col col-container moneyline">
                    <div className="box">Win</div>
                </div>
                <div className="col title-container">
                    <div className="box">Spread</div>
                </div>
                <div className="col col-container">
                    <div className="box">Totals</div>
                </div>
            </div>
            {console.log(basketballBets)}
            {basketballBets.map(bet => {
                return(
                    <div className="row row-container">
                        <div className="col col-container-teams">
                            {getSportsBook(bet.bookmakers).markets[0] && <div className="box-teams">{getSportsBook(bet.bookmakers).markets[0].outcomes[0].name}</div>}
                            <hr/>
                            {getSportsBook(bet.bookmakers).markets[0] && <div className="box-teams">{getSportsBook(bet.bookmakers).markets[0].outcomes[1].name}</div>}
                        </div>
                        <div className="col col-container moneyline">
                            {getSportsBook(bet.bookmakers).markets[0] && <button className="box" onClick={() => addBet({"home_team": bet.home_team, "away_team": bet.away_team, "market":getSportsBook(bet.bookmakers).markets[0], "outcome":getSportsBook(bet.bookmakers).markets[0].outcomes[0]})}>{getSportsBook(bet.bookmakers).markets[0].outcomes[0].price > 0 && <span>+</span>}{getSportsBook(bet.bookmakers).markets[0].outcomes[0].price}</button>}
                            <hr/>
                            {getSportsBook(bet.bookmakers).markets[0] && <button className="box" onClick={() => addBet({"home_team": bet.home_team, "away_team": bet.away_team, "market":getSportsBook(bet.bookmakers).markets[0], "outcome":getSportsBook(bet.bookmakers).markets[0].outcomes[1]})}>{getSportsBook(bet.bookmakers).markets[0].outcomes[1].price > 0 && <span>+</span>}{getSportsBook(bet.bookmakers).markets[0].outcomes[1].price}</button>}
                        </div>
                        <div className="col col-container">
                            {getSportsBook(bet.bookmakers).markets[1] && <button className="box" onClick={() => addBet({"home_team": bet.home_team, "away_team": bet.away_team, "market":getSportsBook(bet.bookmakers).markets[1], "outcome":getSportsBook(bet.bookmakers).markets[1].outcomes[0]})}><span className="gray">{getSportsBook(bet.bookmakers).markets[1].outcomes[0].point > 0 && <span>+</span>}{getSportsBook(bet.bookmakers).markets[1].outcomes[0].point}</span> ({getSportsBook(bet.bookmakers).markets[1].outcomes[0].price})</button>}
                            <hr/>
                            {getSportsBook(bet.bookmakers).markets[1] && <button className="box" onClick={() => addBet({"home_team": bet.home_team, "away_team": bet.away_team, "market":getSportsBook(bet.bookmakers).markets[1], "outcome":getSportsBook(bet.bookmakers).markets[1].outcomes[1]})}><span className="gray">{getSportsBook(bet.bookmakers).markets[1].outcomes[1].point > 0 && <span>+</span>}{getSportsBook(bet.bookmakers).markets[1].outcomes[1].point}</span> ({getSportsBook(bet.bookmakers).markets[1].outcomes[1].price})</button>}
                        </div>
                        <div className="col col-container">
                            {getSportsBook(bet.bookmakers).markets[2] && <button className="box" onClick={() => addBet({"home_team": bet.home_team, "away_team": bet.away_team, "market":getSportsBook(bet.bookmakers).markets[2], "outcome":getSportsBook(bet.bookmakers).markets[2].outcomes[0]})}><span className="gray">O{getSportsBook(bet.bookmakers).markets[2].outcomes[0].point}</span> ({getSportsBook(bet.bookmakers).markets[2].outcomes[0].price})</button>}
                            <hr/>
                            {getSportsBook(bet.bookmakers).markets[2] && <button className="box" onClick={() => addBet({"home_team": bet.home_team, "away_team": bet.away_team, "market":getSportsBook(bet.bookmakers).markets[2], "outcome":getSportsBook(bet.bookmakers).markets[2].outcomes[1]})}><span className="gray">U{getSportsBook(bet.bookmakers).markets[2].outcomes[1].point}</span> ({getSportsBook(bet.bookmakers).markets[2].outcomes[1].price})</button>}
                        </div>
                    </div>
                )
            })}
             <ActiveBets deleteBet={deleteBet} setActiveBets={setActiveBets} activeBets={activeBets} setSuccess={setSuccess}/>
            </div>
    )
}