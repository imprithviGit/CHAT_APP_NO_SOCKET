const express = require('express');
const bodyParser = require('body-parser');
const sse = require('express-sse');
const path = require('path');
const ejs = require('ejs');

const app = express();
const port = process.env.PORT || 3000;

const sseInstance = new sse();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set the views directory

app.get('/stream', sseInstance.init);

app.post('/chat', (req, res) => {
    const chat = req.body;
    chat.time = new Date().toLocaleTimeString();

    // Handle the error using a try-catch block
    try {
        // Perform your SSE broadcasting or any other operations here
        sseInstance.send(chat, 'chat');
        res.status(201).json(chat);
    } catch (error) {
        console.error('Error while processing chat:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.get('/', (req, res) => {
    res.render('index', { user: req.query.user });
});

app.post('/room', (req, res) => {
    const user = req.body.user;
    res.render('chat', { user });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
