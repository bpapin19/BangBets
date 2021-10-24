import { React, useState, useEffect } from 'react';
import axios from 'axios';

import './Bets.css';
import ActiveBets from './ActiveBets';


  export default function FootballBets() {

    const [footballBets, setFootballBets] = useState([]);
    const [activeBets, setActiveBets] = useState([]);
    var activeBetsArray = [];

    var baseUrl = "https://api.the-odds-api.com";

    useEffect(() => {
        axios({
            method: 'get',
            url: baseUrl + `/v4/sports/americanfootball_nfl/odds/?apiKey=${process.env.REACT_APP_ODDS_API_KEY}&regions=us&markets=h2h,spreads,totals&oddsFormat=american`,
          })
          .then(res => {
            // Set arrays
            setFootballBets(res.data);
          });
    }, []);

    function addBet(bet) {
        activeBetsArray = activeBets.concat(bet);
        setActiveBets(activeBetsArray);
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
            <div className="row title-container">
                <div className="col teams-title-container">
                    <div className="title-game">Game</div>
                </div>
                <div className="col title-container">
                    <div className="title">Moneyline</div>
                </div>
                <div className="col title-container">
                    <div className="title">Spread</div>
                </div>
                <div className="col title-container">
                    <div className="title">Totals</div>
                </div>
            </div>
            {console.log(footballBets)}
            {/* <div className="row row-container">
                <div className="col col-container-teams">
                    <div className="box-teams">Panthers</div>
                    <hr/>
                    <div className="box-teams">Jaguars</div>
                </div>
                <div className="col col-container">
                    <button onClick={() => addBet("Moneyline")} className="box">+200</button>
                    <hr/>
                    <button className="box">-200</button>
                </div>
                <div className="col col-container">
                    <button onClick={() => addBet("Spread")} className="box">-8 (-110)</button>
                    <hr/>
                    <button className="box">+8 (-110)</button>
                </div>
                <div className="col col-container">
                    <button className="box">O56 (-110)</button>
                    <hr/>
                    <button className="box">U56 (-110)</button>
                </div>
            </div> */}
            {footballBets.map(bet => {
                return(
                    <div className="row row-container">
                        <div className="col col-container-teams">
                            <div className="box-teams">{getSportsBook(bet.bookmakers).markets[0].outcomes[0].name}</div>
                            <hr/>
                            <div className="box-teams">{getSportsBook(bet.bookmakers).markets[0].outcomes[1].name}</div>
                        </div>
                        <div className="col col-container">
                            <button className="box" onClick={() => addBet({"home_team": bet.home_team, "away_team": bet.away_team, "market":getSportsBook(bet.bookmakers).markets[0], "outcome":getSportsBook(bet.bookmakers).markets[0].outcomes[0]})}>{getSportsBook(bet.bookmakers).markets[0].outcomes[0].price}</button>
                            <hr/>
                            <button className="box" onClick={() => addBet({"home_team": bet.home_team, "away_team": bet.away_team, "market":getSportsBook(bet.bookmakers).markets[0], "outcome":getSportsBook(bet.bookmakers).markets[0].outcomes[1]})}>{getSportsBook(bet.bookmakers).markets[0].outcomes[1].price}</button>
                        </div>
                        <div className="col col-container">
                            <button className="box" onClick={() => addBet({"home_team": bet.home_team, "away_team": bet.away_team, "market":getSportsBook(bet.bookmakers).markets[1], "outcome":getSportsBook(bet.bookmakers).markets[1].outcomes[0]})}>{getSportsBook(bet.bookmakers).markets[1].outcomes[0].point} ({getSportsBook(bet.bookmakers).markets[1].outcomes[0].price})</button>
                            <hr/>
                            <button className="box" onClick={() => addBet({"home_team": bet.home_team, "away_team": bet.away_team, "market":getSportsBook(bet.bookmakers).markets[1], "outcome":getSportsBook(bet.bookmakers).markets[1].outcomes[1]})}>{getSportsBook(bet.bookmakers).markets[1].outcomes[1].point} ({getSportsBook(bet.bookmakers).markets[1].outcomes[1].price})</button>
                        </div>
                        <div className="col col-container">
                            <button className="box" onClick={() => addBet({"home_team": bet.home_team, "away_team": bet.away_team, "market":getSportsBook(bet.bookmakers).markets[2], "outcome":getSportsBook(bet.bookmakers).markets[2].outcomes[0]})}>O{getSportsBook(bet.bookmakers).markets[2].outcomes[0].point} ({getSportsBook(bet.bookmakers).markets[2].outcomes[0].price})</button>
                            <hr/>
                            <button className="box" onClick={() => addBet({"home_team": bet.home_team, "away_team": bet.away_team, "market":getSportsBook(bet.bookmakers).markets[2], "outcome":getSportsBook(bet.bookmakers).markets[2].outcomes[1]})}>U{getSportsBook(bet.bookmakers).markets[2].outcomes[1].point} ({getSportsBook(bet.bookmakers).markets[2].outcomes[1].price})</button>
                        </div>
                    </div>
                )
            })}
             <ActiveBets deleteBet={deleteBet} setActiveBets={setActiveBets} activeBets={activeBets}/>
            </div>
    )
}