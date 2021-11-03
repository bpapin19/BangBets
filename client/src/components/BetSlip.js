import React, { Component, useState, useEffect } from 'react';
import {Card} from 'react-bootstrap';
import { AiOutlineDown } from "react-icons/ai";
import { AiOutlineUp } from "react-icons/ai";
import { useAuth } from '../contexts/AuthContext'
import Collapsible from 'react-collapsible';
import axios from "axios";

export function BetSlip(props) {

    const [open, setOpen] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [betAmount, setBetAmount] = useState(0);
    const [winAmount, setWinAmount] = useState(0);
    const currentUser = useAuth();

    const baseRouteUrl = process.env.REACT_APP_ROUTE_URL;

    const Market_Names = {"h2h": "Moneyline", "spreads": "Spread", "totals": "Total"};

    var singleBet;
    var parlay;

    useEffect(() => {
        props.setActiveBets(props.activeBets);
        if (props.activeBets.length !== 0) {
            // Disable submit button if bet amount is empty
            if (document.getElementById("risk").value === "") { 
                setDisabled(true);
            }
            //Open bet slip on add bet click
            setOpen(true);
        } else {
            setOpen(false);
            // set amount to 0 if bet slip is empty
            setBetAmount(0);
            setWinAmount(0);
        }
    }, [props]);

    function collapseBetSlip() {
        if (open) {
            setOpen(false);
        } else {
            setOpen(true);
        }
    }

    function multiply(array) {
        var prod = 1;
        for (var i = 0; i < array.length; i++) {
            prod = prod * array[i];
        }
        return prod;
    }

    function calculatePrices(betAmount) {
        var decimalOdds = [];
        setBetAmount(betAmount);
        if (props.activeBets.length === 1) {
            var outcome = props.activeBets[0].outcome;
            singleBet = outcome.price > 0 
                ? parseFloat(outcome.price/100 * betAmount).toFixed(2)
                : parseFloat((100/Math.abs(outcome.price)) * betAmount).toFixed(2);
            setWinAmount(singleBet);
        } else if (props.activeBets.length > 1) {
            props.activeBets.map(parlayBet => {
                if (parlayBet.outcome.price < 0) {
                    decimalOdds.push((100/Math.abs(parlayBet.outcome.price)) + 1);
                } else {
                    decimalOdds.push((parlayBet.outcome.price/100) + 1);
                }
            });
            parlay = parseFloat((betAmount * multiply(decimalOdds)) - betAmount).toFixed(2);
            setWinAmount(parlay);
        }
    }

    function riskKeyUp() {
        if (document.getElementById("risk").value === "") { 
            setDisabled(true);
            calculatePrices(0, 0);
            document.getElementById('win').value = "";
        } else {
            setDisabled(false);
            calculatePrices(document.getElementById("risk").value);
            document.getElementById('win').value = props.activeBets.length === 1 ? singleBet : parlay;
        }
    }

    function clearFields() {
        document.getElementById("risk").value = "";
        document.getElementById('win').value = "";
        setBetAmount(0);
        setWinAmount(0);
    }

    function placeBets(activeBets) {
        axios({
            method: 'post',
            url: baseRouteUrl + "/api/bet",
            data: {
              userId: currentUser.currentUser.uid,
              userEmail: currentUser.currentUser.email,
              betAmount: betAmount,
              winAmount: winAmount,
              game: activeBets
            }
          })
          .then(res => {
            props.setActiveBets([]);
            props.setSuccess(res.data.message);
          })
          .catch(function() {
            props.setError("Unable to add your bet");
          });
          
    }

    return (
        <Card className="bet-slip-container content">
            <h1 className="active-bets-header">Bet Slip 
                <span>
                    <button className="hide-bet-slip-button" onClick={() => collapseBetSlip()}>
                        {open && <AiOutlineDown/>}{!open && <AiOutlineUp/>}
                    </button>
                </span>
            </h1>
            <Collapsible transitionTime={300} open={open}>
                {props.activeBets.length === 1 && <div className="bet-type">Single</div>}
                {props.activeBets.length > 1 && <div className="bet-type">Parlay ({props.activeBets.length} picks)</div>}
                <div className="active-bets-list">
                    {props.activeBets.map(bet => {
                        return(
                            <div key={bet.id} className="active-bet-container">
                                <div className="active-bet">
                                    {bet["outcome"].name}
                                    {bet["market"].key === "spreads" && <span> {bet["outcome"].point > 0 && <span>+</span>}{bet["outcome"].point}</span>}
                                    {bet["market"].key === "totals" && <span> {bet["outcome"].point}</span>}
                                    <span className="active-price">{bet["outcome"].price > 0 && <span>+</span>}{bet["outcome"].price}</span>
                                </div>
                                <span>
                                    <button className="remove-bet-button" onClick={() => {props.deleteBet(bet); clearFields()}}>
                                        X
                                    </button>
                                </span>
                                <div className="active-bet">
                                    {Market_Names[bet["market"].key]}
                                </div>
                                <div className="game">{bet.sport} - {bet["away_team"]} @ {bet["home_team"]}</div>
                            </div>
                        )
                    })}
                </div>
                {props.activeBets.length !== 0 &&
                <div className="bet-amount">
                    <div className="row">
                        <div className="col">
                            <input type="number" min="1" id="risk" className="inputText" onKeyUp={() => riskKeyUp()} required/>
                            <span className="floating-label">Risk</span>
                        </div>
                        <div className="col">
                            <input type="number" id="win" className="inputText" disabled/>
                            <span className="floating-label">Win</span>
                        </div>
                    </div>
                </div>
                }
                <div className="bet-details">   
                    <div>Total Bets: <span className="bet-num">{props.activeBets.length}</span></div>
                    <div>Total Stake: <span className="bet-num">${betAmount}</span></div>
                    <div>Possible Winnings: <span className="bet-num">${winAmount}</span></div>
                </div>
                <div className="place-bets-button-container">
                    {props.activeBets.length !== 0 && open && <button id="place-bets-button" onClick={() => placeBets(props.activeBets)} className="place-bets-button" disabled={disabled}>Place Bets</button>}
                </div>
            </Collapsible>
        </Card>
    )
   
};

export default BetSlip;