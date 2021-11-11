import { React, useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import axios from 'axios';
import './Bets.css';
import BetSlip from './BetSlip';


  export default function BaseballBets() {

    const [baseballBets, setBaseballBets] = useState([]);
    const [activeBets, setActiveBets] = useState([]);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    var activeBetsArray = [];

    var baseOddsUrl = process.env.REACT_APP_ODDS_URL;

    useEffect(() => {
        axios({
            method: 'get',
            url: baseOddsUrl + `/v4/sports/baseball_mlb/odds/?apiKey=${process.env.REACT_APP_ODDS_API_KEY}&regions=us&markets=h2h,spreads,totals&oddsFormat=american`,
          })
          .then(res => {
            // Set arrays
            setBaseballBets(res.data);
          });
    }, []);

    function containsObject(obj, list) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].id === obj.id) {
                return true;
            }
        }
        return false;
    }

    function addBet(bet) {
        if (!containsObject(bet, activeBets)) {
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
            if (booksArray[i].key === "barstool" || booksArray[i].key === "fanduel") {
                return booksArray[i];
            }
        }
    }

    function generateUniqueID(bet_id, market) {
        return "" + bet_id + "_" + market;
    }

    return (
        <div className="bet-container">
            {success !== "" && <Alert variant="success" className="success">{success}</Alert>}
            {error !=="" && <Alert variant="danger" className="error">{error}</Alert>}
            <div className="row title-container">
                <div className="col col-container-teams">
                    <div className="">Game</div>
                </div>
                <div className="col col-container moneyline">
                    <div className="">Win</div>
                </div>
                <div className="col col-container">
                    <div className="">Spread</div>
                </div>
                <div className="col col-container">
                    <div className="">Totals</div>
                </div>
            </div>
            {console.log(baseballBets)}
            {baseballBets.map(game => {
                var moneyline = "";
                var spread = "";
                var total = "";
                var sportsBook = getSportsBook(game.bookmakers);

                // Sometimes bet outcomes are not avaliable, make sure bets are still correct
                for (var betIndex=0; betIndex < sportsBook.markets.length; betIndex++) {
                    switch (sportsBook.markets[betIndex].key) {
                        case "h2h":
                            moneyline = sportsBook.markets[betIndex];
                            break;
                        case "spreads":
                            spread = sportsBook.markets[betIndex];
                            break;
                        case "totals":
                            total = sportsBook.markets[betIndex];
                            break;
                        default:
                            break;
                    }
                }

                return(
                    <div key={game.id} className="row row-container">
                        <div className="col col-container-teams">
                            {moneyline && <div className="box-teams">{moneyline.outcomes[0].name}</div>}
                            <hr/>
                            {moneyline && <div className="box-teams">{moneyline.outcomes[1].name}</div>}
                        </div>
                        <div className="col col-container moneyline">
                            {moneyline && <button className="box" onClick={() => addBet({"id": generateUniqueID(game.id, moneyline.key), "home_team": game.home_team, "away_team": game.away_team, "market":moneyline, "outcome":moneyline.outcomes[0], "commence_time": game.commence_time, "sport": game.sport_title})}>{moneyline.outcomes[0].price > 0 && <span>+</span>}{moneyline.outcomes[0].price}</button>}
                            <hr/>
                            {moneyline && <button className="box" onClick={() => addBet({"id": generateUniqueID(game.id, moneyline.key), "home_team": game.home_team, "away_team": game.away_team, "market":moneyline, "outcome":moneyline.outcomes[1], "commence_time": game.commence_time, "sport": game.sport_title})}>{moneyline.outcomes[1].price > 0 && <span>+</span>}{moneyline.outcomes[1].price}</button>}
                        </div>
                        <div className="col col-container spread">
                            {spread && <button className="box" onClick={() => addBet({"id": generateUniqueID(game.id, spread.key), "home_team": game.home_team, "away_team": game.away_team, "market":spread, "outcome":spread.outcomes[0], "commence_time": game.commence_time, "sport": game.sport_title})}><span className="gray">{spread.outcomes[0].point > 0 && <span>+</span>}{spread.outcomes[0].point}</span> ({spread.outcomes[0].price})</button>}
                            <hr/>
                            {spread && <button className="box" onClick={() => addBet({"id": generateUniqueID(game.id, spread.key), "home_team": game.home_team, "away_team": game.away_team, "market":spread, "outcome":spread.outcomes[1], "commence_time": game.commence_time, "sport": game.sport_title})}><span className="gray">{spread.outcomes[1].point > 0 && <span>+</span>}{spread.outcomes[1].point}</span> ({spread.outcomes[1].price})</button>}
                        </div>
                        <div className="col col-container">
                            {total && <button className="box" onClick={() => addBet({"id": generateUniqueID(game.id, total.key), "home_team": game.home_team, "away_team": game.away_team, "market":total, "outcome":total.outcomes[0], "commence_time": game.commence_time, "sport": game.sport_title})}><span className="gray">O{total.outcomes[0].point}</span> ({total.outcomes[0].price})</button>}
                            <hr/>
                            {total && <button className="box" onClick={() => addBet({"id": generateUniqueID(game.id, total.key), "home_team": game.home_team, "away_team": game.away_team, "market":total, "outcome":total.outcomes[1], "commence_time": game.commence_time, "sport": game.sport_title})}><span className="gray">U{total.outcomes[1].point}</span> ({total.outcomes[1].price})</button>}
                        </div>
                    </div>
                )
            })}
             <BetSlip deleteBet={deleteBet} setActiveBets={setActiveBets} activeBets={activeBets} setSuccess={setSuccess} setError={setError}/>
            </div>
    )
}