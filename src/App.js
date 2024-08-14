import React, { useState, useEffect } from 'react';

const Circle = ({ id, position, onClick, isClicked, animationDuration }) => (
  <div
    onClick={() => onClick(id)}
    style={{
      position: 'absolute',
      ...position,
      width: 50,
      height: 50,
      borderRadius: '50%',
      backgroundColor: isClicked ? 'red' : 'white',
      border: '2px solid black',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: `background-color ${animationDuration}s ease`,
    }}
  >
    {id}
  </div>
);

function App() {
  const [circleCount, setCircleCount] = useState(10);
  const [circles, setCircles] = useState([]);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [nextExpected, setNextExpected] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [clickedCircle, setClickedCircle] = useState(null);
  const [buttonColor, setButtonColor] = useState('white');
  const animationDuration = 0.3;

  useEffect(() => {
    let timer;
    if (timerActive && !gameOver) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 0.1);
      }, 100);
    }
    return () => clearInterval(timer);
  }, [timerActive, gameOver]);

  const handleCircleClick = (id) => {
    if (id === nextExpected && !clickedCircle) {
      setClickedCircle(id);
      setTimeout(() => {
        setCircles((prevCircles) => prevCircles.filter(circle => circle.id !== id));
        setNextExpected((prevNext) => prevNext + 1);
        setClickedCircle(null);
      }, animationDuration * 1000);
    } else if (id !== nextExpected) {
      setGameOver(true);
      setTimerActive(false);
    }
  };

  const handleRestart = () => {
    const newCircles = Array.from({ length: circleCount }, (_, index) => ({
      id: index + 1,
      position: {
        top: `${Math.random() * 90}%`,
        left: `${Math.random() * 90}%`,
      },
    })).sort((a, b) => b.id - a.id); 

    setCircles(newCircles);
    setTime(0);
    setNextExpected(1);
    setGameOver(false);
    setClickedCircle(null);
    setTimerActive(true);
    setButtonColor('white');
  };

  useEffect(() => {
    if (circles.length === 0 && !gameOver) {
      setTimerActive(false);
    }
  }, [circles, gameOver]);

  return (
    <div style={{ padding: 20, textAlign: 'center',
      border: '2px solid #333',
      borderRadius: '15px',
      maxWidth: 460,
      maxHeight: 670,
      margin: '2px auto',
      backgroundColor: '#eaeaea',
     }}>
      <h2 style={{ color: gameOver ? 'red' : circles.length === 0 ? 'green' : 'black' }}>
        {gameOver ? 'Game Over' : circles.length === 0 ? 'ALL CLEARED' : "LET'S PLAY"}
      </h2>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '10px',
        margin: '0 auto 20px',
        maxWidth: 450,
      }}>
        <div>
          Points:
          <input
            type="number"
            value={circleCount}
            onChange={(e) => setCircleCount(Number(e.target.value))}
            style={{ marginLeft: 30, width: 100 }}
          />
        </div>
        <div>
          Time: <span style={{ marginLeft: '30px' }}>{time.toFixed(1)}s</span>
        </div>
        <button
          style={{
            width: 80,
            backgroundColor: buttonColor,
            cursor: 'pointer',
            border: '1px solid black',
            transition: 'background-color 0.3s ease',
          }}
          onClick={() => {
            handleRestart();
            setButtonColor('lightgray');
            setTimeout(() => setButtonColor('white'), 300);
          }}
        >
          {circles.length === 0 ? 'Start' : 'Restart'}
        </button>
      </div>
      <div
        style={{
          position: 'relative',
          width: 450,
          height: 500,
          border: '3px solid #333',
          borderRadius: '10px',
          margin: '20px auto',
          backgroundColor: '#f8f8f8'
        }}
      >
        {circles.map(circle => (
          <Circle
            key={circle.id} {...circle}
            onClick={handleCircleClick}
            isClicked={clickedCircle === circle.id}
            animationDuration={animationDuration}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
