import React, { useState, useEffect } from 'react';
import { img } from '../data';  
import './Board.css';  

const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const Board = () => {
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [move, setMove] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [gameScore, setGameScore] = useState(0);

    useEffect(() => {
        createBoard();
    }, []);

    const createBoard = () => {
        const dupCards = img.flatMap((image) => {
            const duplicate = {
                ...image,
                id: image.id + img.length,
            };
            return [image, duplicate];
        });

        const shuffledCards = shuffle(dupCards);
        const initializedCards = shuffledCards.map(card => ({
            ...card,
            flipped: false,
            matched: false,
        }));

        setCards(initializedCards);
        setGameScore(0); 
        setMove(0); 
        setGameOver(false); 
    };

    const handleCardClick = (index) => {
        if (isDisabled || cards[index].flipped || cards[index].matched) return;

        const newCards = [...cards];
        newCards[index].flipped = true;

        setCards(newCards);
        setFlippedCards([...flippedCards, index]);

        if (flippedCards.length === 1) {
            setIsDisabled(true);
            setTimeout(() => {
                checkMatch(newCards, index);
            }, 1000);
        }
    };

    const checkMatch = (newCards, index) => {
        const [firstIndex] = flippedCards;
        if (newCards[firstIndex].id === newCards[index].id) {
            newCards[firstIndex].matched = true;
            newCards[index].matched = true;
            setGameScore(gameScore + 1);  
        } else {
            newCards[firstIndex].flipped = false;
            newCards[index].flipped = false;
        }

        setCards(newCards);
        setFlippedCards([]);
        setIsDisabled(false);
        setMove(move + 1);

        if (newCards.every(card => card.matched)) {
            setGameOver(true);
        }
    };

    const resetGame = () => {
        createBoard();
    };

    return (
        <div className='relative h-screen flex flex-col items-center -4 m-5'>
            <h1 className="font-bold text-4xl mb-8 pb-8 p-9 m-6">Juego de desafios</h1>
            {!gameOver && (
                <>
                    <div className="grid grid-cols-4 gap-4">
                        {cards.map((card, index) => (
                            <div
                                key={index}
                                className={`card ${card.flipped ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
                                onClick={() => handleCardClick(index)}
                            >
                                <div className="card-inner">
                                    <div className="card-front">
                                        <img src={card.img} alt="card front" className="w-full h-full object-cover"/>
                                    </div>
                                    <div className="card-back">
                                     </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="score mt-4">
                        <p>Puntajes: {gameScore}</p>
                        <p>Movimientos: {move}</p>
                    </div>
                </>
            )}
            {gameOver && (
                <div className="game-over">
                    <p> {gameScore} Movimientos: {move}</p>
                    <button onClick={resetGame} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Reiniciar Juego</button>
                </div>
            )}
        </div>
    );
};

export default Board;
