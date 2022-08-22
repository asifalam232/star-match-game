import React, {useEffect, useState} from "react";
import utils from "./math-utils";
import PlayAgain from "./PlayAgain";
import StarDisplay from "./StarDisplay";
import PlayNumber from "./PlayNumber";

const useGameState = () => {
    const [stars, setStars] = useState(utils.random(1, 9));
    const [availableNumbers, setAvailableNumbers] = useState(utils.range(1, 9));
    const [candidateNumbers, setCandidateNumbers] = useState([]);
    const [secondsLeft, setSecondsLeft] = useState(15);

    useEffect(() => {
        if (secondsLeft > 0 && availableNumbers.length > 0)
        {
            const timerId = setTimeout(() => {
                setSecondsLeft(secondsLeft - 1);
            }, 1000);

            return () => clearTimeout(timerId);
        }
    });

    const setGameState = (newCandidateNumbers) => {
        if (utils.sum(newCandidateNumbers) !== stars)
        {
            setCandidateNumbers(newCandidateNumbers);
        }
        else
        {
            const newAvailableNumbers = availableNumbers.filter(
                n => !newCandidateNumbers.includes(n)
            );

            setStars(utils.randomSumIn(newAvailableNumbers, 9));
            setAvailableNumbers(newAvailableNumbers);
            setCandidateNumbers([]);
        }
    };

    return { stars, availableNumbers, candidateNumbers, secondsLeft, setGameState };
};

const Game = (props) => {
    const {
        stars,
        availableNumbers,
        candidateNumbers,
        secondsLeft,
        setGameState,
    } = useGameState();

    const candidatesAreWrong = utils.sum(candidateNumbers) > stars;
    const gameStatus = availableNumbers.length === 0
        ? 'won' : secondsLeft === 0 ? 'lost' : 'active';


    const numberStatus = (number) => {
        if (!availableNumbers.includes(number))
        {
            return 'used';
        }
        if (candidateNumbers.includes(number))
        {
            return candidatesAreWrong ? 'wrong' : 'candidate';
        }

        return 'available';
    };

    const onNumberClick = (number, currentStatus) => {
        if (gameStatus !== 'active' || currentStatus === 'used')
        {
            return;
        }
        const newCandidateNumbers =
            currentStatus === 'available'
                ? candidateNumbers.concat(number)
                : candidateNumbers.filter(cn => cn !== number);

        setGameState(newCandidateNumbers);

    };

    return (
        <div className="game">
            <div className="help">
                Pick 1 or more numbers that sum to the number of stars
            </div>
            <div className="body">
                <div className="left">
                    {gameStatus !== 'active' ? (
                        <PlayAgain onClick={props.startNewGame} gameStatus={gameStatus}/>
                    ) : (
                        <StarDisplay count={stars}/>
                    )}
                </div>
                <div className="right">
                    {utils.range(1, 9).map(number =>
                        <PlayNumber
                            key={number}
                            status={numberStatus(number)}
                            number={number}
                            onClick={onNumberClick}
                        />
                    )}
                </div>
            </div>
            <div className="timer">Time Remaining: {secondsLeft}</div>
        </div>
    );
};

export default Game;