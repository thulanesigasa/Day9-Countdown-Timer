import React, { useState, useEffect } from 'react';
import '../styles/theme.css';

const CountdownTimer: React.FC = () => {
    const [targetDate, setTargetDate] = useState<string>('');
    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        let interval: number | undefined;

        if (isActive && targetDate) {
            interval = setInterval(() => {
                const now = new Date().getTime();
                const target = new Date(targetDate).getTime();
                const distance = target - now;

                if (distance < 0) {
                    clearInterval(interval);
                    setIsActive(false);
                    setTimeLeft(null);
                    setMessage("Time's up! 🎉");
                } else {
                    setTimeLeft({
                        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                        seconds: Math.floor((distance % (1000 * 60)) / 1000),
                    });
                }
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isActive, targetDate]);

    const handleStart = () => {
        if (!targetDate) {
            alert("Please select a valid date and time.");
            return;
        }
        const target = new Date(targetDate).getTime();
        const now = new Date().getTime();

        if (target <= now) {
            alert("Please select a future date and time.");
            return;
        }

        setIsActive(true);
        setMessage('');

        // Initial calculation to avoid 1s delay
        const distance = target - now;
        setTimeLeft({
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
    };

    const handleReset = () => {
        setIsActive(false);
        setTimeLeft(null);
        setTargetDate('');
        setMessage('');
    };

    const formatTime = (time: number) => (time < 10 ? `0${time}` : time);

    // Set min attribute to current local time for input
    const getMinDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };

    return (
        <div className="mil-wrapper">
            <div className="container">
                <header>
                    <h1 className="mil-h1"><span className="mil-thin">Countdown</span> <span className="mil-accent">Timer</span></h1>
                    <p className="mil-text-lg mil-light-soft">Set your target date and watch the time fly!</p>
                </header>

                {!isActive && !message && (
                    <div className="input-group">
                        <label htmlFor="target-datetime" className="mil-upper mil-muted">Select Target Date & Time:</label>
                        <input
                            type="datetime-local"
                            id="target-datetime"
                            value={targetDate}
                            min={getMinDateTime()}
                            onChange={(e) => setTargetDate(e.target.value)}
                            className="mil-input"
                        />
                        <button onClick={handleStart} className="mil-button mil-arrow-place">
                            <span>Start Countdown</span>
                        </button>
                    </div>
                )}

                {isActive && timeLeft && (
                    <div className="timer-display">
                        <div className="time-unit">
                            <span className="time-value">{formatTime(timeLeft.days)}</span>
                            <span className="label mil-upper mil-muted">Days</span>
                        </div>
                        <div className="separator mil-accent">:</div>
                        <div className="time-unit">
                            <span className="time-value">{formatTime(timeLeft.hours)}</span>
                            <span className="label mil-upper mil-muted">Hours</span>
                        </div>
                        <div className="separator mil-accent">:</div>
                        <div className="time-unit">
                            <span className="time-value">{formatTime(timeLeft.minutes)}</span>
                            <span className="label mil-upper mil-muted">Minutes</span>
                        </div>
                        <div className="separator mil-accent">:</div>
                        <div className="time-unit">
                            <span className="time-value">{formatTime(timeLeft.seconds)}</span>
                            <span className="label mil-upper mil-muted">Seconds</span>
                        </div>

                        <div style={{ width: '100%', marginTop: '2rem' }}>
                            <button onClick={handleReset} className="mil-button mil-icon-button-sm mil-arrow-place" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#fff', width: 'auto', padding: '0 30px' }}>
                                <span>Reset</span>
                            </button>
                        </div>
                    </div>
                )}

                {message && (
                    <div className="message-container">
                        <h2 className="mil-h2 mil-accent">{message}</h2>
                        <button onClick={handleReset} className="mil-button mil-arrow-place" style={{ marginTop: '20px' }}>
                            <span>New Countdown</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CountdownTimer;
