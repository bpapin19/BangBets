import React, { Component, useState, useEffect } from 'react';
import {Card} from 'react-bootstrap';
import { AiOutlineDown } from "react-icons/ai";
import { AiOutlineUp } from "react-icons/ai";
import Collapsible from 'react-collapsible';

export function ActiveBets(props) {

    const [open, setOpen] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [betAmount, setBetAmount] = useState(0);
    const [winAmount, setWinAmount] = useState(0);

    var singleBet;
    var parlay;

    useEffect(() => {
        props.setActiveBets(props.activeBets);
        if (props.activeBets.length !== 0) {
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
        var sum = 1;
        for (var i = 0; i < array.length; i++) {
            sum = sum * array[i];
        }
        return sum;
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
            parlay = parseFloat(betAmount * multiply(decimalOdds)).toFixed(2);
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

    function placeBets() {
        props.setActiveBets([]);
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
                            <div className="active-bet-container">
                                <div className="active-bet">
                                    {bet["market"].key}
                                </div>
                                <div className="active-bet">
                                    {bet["outcome"].name}
                                </div>
                                <div className="game">{bet["away_team"]} @ {bet["home_team"]}</div>
                                <span>
                                    <button className="remove-bet-button" onClick={() => {props.deleteBet(bet); clearFields()}}>
                                        X
                                    </button>
                                </span>
                            </div>
                        )
                    })}
                </div>
                {props.activeBets.length !== 0 &&
                <div className="bet-amount">
                    <div className="row">
                        <div className="col">
                            <input type="number" id="risk" className="inputText" onKeyUp={() => riskKeyUp()} required/>
                            <span className="floating-label">Risk</span>
                        </div>
                        <div className="col">
                            <input type="number" id="win" className="inputText" required/>
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
                    {props.activeBets.length !== 0 && open && <button id="place-bets-button" onClick={() => placeBets()} className="place-bets-button" disabled={disabled}>Place Bets</button>}
                </div>
            </Collapsible>
        </Card>
    )
   
};

export default ActiveBets;