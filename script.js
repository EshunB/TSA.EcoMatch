

import carDatabase from './carDatabase.js';

const questions = [
    {
        question: "What is your budget?",
        answers: [
            { text: "Less Than $30,000", score: { price_score: 1 } },
            { text: "$30,000 To $50,000", score: { price_score: 2 } },
            { text: "$50,000 To $75,000", score: { price_score: 3 } },
            { text: "$75,000 To $100,000", score: { price_score: 4 } },
            { text: "More Than $100,000", score: { price_score: 5 } }
        ]
    },
    {
        question: "How important is style and design to you?",
        answers: [
            { text: "Not Important", score: { style_score: 1 } },
            { text: "Somewhat Important", score: { style_score: 2 } },
            { text: "Important", score: { style_score: 3 } },
            { text: "Very Important", score: { style_score: 4 } },
            { text: "Extremely Important", score: { style_score: 5 } }
        ]
    },
    {
        question: "What range do you need?",
        answers: [
            { text: "Less than 200 miles", score: { range_score: 1, mileage_score: 1 } },
            { text: "200-250 miles", score: { range_score: 2, mileage_score: 2 } },
            { text: "250-300 miles", score: { range_score: 3, mileage_score: 3 } },
            { text: "300-350 miles", score: { range_score: 4, mileage_score: 4 } },
            { text: "More than 350 miles", score: { range_score: 5, mileage_score: 5 } }
        ]
    },
    {
        question: "What size vehicle do you prefer?",
        answers: [
            { text: "Compact Car", score: { size_score: 1 } },
            { text: "Mid-Size Car", score: { size_score: 2 } },
            { text: "Large Car/Crossover", score: { size_score: 3 } },
            { text: "SUV", score: { size_score: 4 } },
            { text: "Large SUV/Van", score: { size_score: 5 } }
        ]
    },
    {
        question: "How many seats do you need?",
        answers: [
            { text: "2 Seats", score: { seats_score: 2, family_score: 0 } },
            { text: "4 Seats", score: { seats_score: 4, family_score: 2 } },
            { text: "5 Seats", score: { seats_score: 5, family_score: 3 } },
            { text: "6-7 Seats", score: { seats_score: 6, family_score: 4 } },
            { text: "8+ Seats", score: { seats_score: 8, family_score: 5 } }
        ]
    },
    {
        question: "What will you use the vehicle for?",
        answers: [
            { text: "Daily Commute", score: { usage_score: 2 } },
            { text: "Family Transport", score: { usage_score: 3 } },
            { text: "Weekend Adventures", score: { usage_score: 4 } },
            { text: "Work/Hauling", score: { usage_score: 5 } }
        ]
    },
    {
        question: "How important is performance?",
        answers: [
            { text: "Not Important", score: { speed_score: 1, performance_score: 1 } },
            { text: "Somewhat Important", score: { speed_score: 2, performance_score: 2 } },
            { text: "Important", score: { speed_score: 3, performance_score: 3 } },
            { text: "Very Important", score: { speed_score: 4, performance_score: 4 } },
            { text: "Extremely Important", score: { speed_score: 5, performance_score: 5 } }
        ]
    }
];

let currentQuestionIndex = 0;
let scores = {
    price_score: 0,
    style_score: 0,
    range_score: 0,
    mileage_score: 0,
    size_score: 0,
    seats_score: 0,
    family_score: 0,
    usage_score: 0,
    speed_score: 0,
    performance_score: 0
};


const startButton = document.getElementById('start-quiz');
const questionContainer = document.getElementById('question-container');
const welcomeScreen = document.getElementById('welcome-screen');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const resultContainer = document.getElementById('result-container');
const resultContent = document.getElementById('result-content');
const restartButton = document.getElementById('restart-btn');

startButton.addEventListener('click', startQuiz);
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    setNextQuestion();
});
restartButton.addEventListener('click', startQuiz);

function startQuiz() {
    welcomeScreen.classList.add('hidden');
    welcomeScreen.classList.remove('active');
    
    resultContainer.classList.add('hidden');
    resultContainer.classList.remove('active');

    questionContainer.classList.remove('hidden');
    questionContainer.classList.add('active');
    

    currentQuestionIndex = 0;
    scores = {
        price_score: 0,
        style_score: 0,
        range_score: 0,
        mileage_score: 0,
        size_score: 0,
        seats_score: 0,
        family_score: 0,
        usage_score: 0,
        speed_score: 0,
        performance_score: 0
    };
    setNextQuestion();
}

function setNextQuestion() {
    resetState();
    if (currentQuestionIndex < questions.length) {
        showQuestion(questions[currentQuestionIndex]);
    } else {
        showResult();
    }
}

function showQuestion(question) {
    questionElement.innerText = question.question;
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        button.addEventListener('click', () => selectAnswer(answer));
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    nextButton.classList.add('hidden');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(answer) {
    const buttons = answerButtonsElement.getElementsByTagName('button');
    Array.from(buttons).forEach(button => {
        button.disabled = true;
        if (button.innerText === answer.text) {
            button.style.background = '#6B8DD6';
        }
    });

    for (let category in answer.score) {
        scores[category] += answer.score[category];
    }

    nextButton.classList.remove('hidden');
}

function findBestMatch(userScores, carDatabase) {
    let bestMatch = null;
    let bestScore = -Infinity;

    for (const car of carDatabase) {
        let matchScore = 0;

        for (const category in userScores) {
            if (car[category] !== undefined) {
                const difference = Math.abs(userScores[category] - car[category]);
                matchScore -= difference;
            }
        }
        
        if (matchScore > bestScore) {
            bestScore = matchScore;
            bestMatch = car;
        }
    }
    
    return bestMatch;
}

function showResult() {
    questionContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    resultContainer.classList.add('active');

    const bestMatch = findBestMatch(scores, carDatabase);

    const top3Matches = carDatabase
        .map(car => ({
            car,
            score: calculateMatchScore(scores, car)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

    resultContent.innerHTML = `
        <div class="car-recommendation">
            <h2>Your Best Match</h2>
            <div class="primary-match">
                <h3>${bestMatch.name}</h3>
                <p>${bestMatch.description}</p>
                <p><strong>Price:</strong> ${bestMatch.price}</p>
                <p><strong>Range:</strong> ${bestMatch.range}</p>
                <div class="car-details">
                    <p><strong>Key Features:</strong></p>
                    <ul>
                        <li>Style Rating: ${bestMatch.style_score}/5</li>
                        <li>Performance Rating: ${bestMatch.performance_score}/5</li>
                        <li>Family-Friendly Rating: ${bestMatch.family_score}/5</li>
                        <li>Seating Capacity Score: ${bestMatch.seats_score}/8</li>
                    </ul>
                </div>
            </div>
            
            <h3>Other Great Matches</h3>
            <div class="alternative-matches">
                ${top3Matches.slice(1).map(match => `
                    <div class="alternative-match">
                        <h4>${match.car.name}</h4>
                        <p>${match.car.description}</p>
                        <p><strong>Price:</strong> ${match.car.price}</p>
                        <p><strong>Range:</strong> ${match.car.range}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function calculateMatchScore(userScores, car) {
    let matchScore = 0;
    for (const category in userScores) {
        if (car[category] !== undefined) {
            const difference = Math.abs(userScores[category] - car[category]);
            matchScore -= difference;
        }
    }
    return matchScore;
} 