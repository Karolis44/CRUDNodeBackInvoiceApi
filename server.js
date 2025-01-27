const express = require('express');
const app = express();
const URL = 'http://localhost:3000/'
const fs = require('fs');
const handlebars = require('handlebars');
const bodyParser = require('body-parser');
const urlApi = "https://in3.dev/inv/";
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
const md5 = require('md5');






// Helpers

const makeHtml = (data, page) => {

    data.url = URL;
    const topHtml = fs.readFileSync(`./templates/top.hbr`, 'utf8');
    const bottomHtml = fs.readFileSync(`./templates/bottom.hbr`, 'utf8');
    const pageHtml = fs.readFileSync(`./templates/${page}.hbr`, 'utf8');
    const html = handlebars.compile(topHtml + pageHtml + bottomHtml)(data);
    return html;
}


const updateSession = (req, prop, data) => {
    const sessionId = req.user.sessionId;
    let sessions = fs.readFileSync('./data/session.json', 'utf8');
    sessions = JSON.parse(sessions);
    let session = sessions.find(s => s.sessionId === sessionId);
    if(!session){
        return;
    }
    if (null === data) {
        delete session[prop];
    } else {
        session[prop] = data;
    }
    sessions = JSON.stringify(sessions);
    fs.writeFileSync('./data/session.json', sessions);
    
}

// Midleware





// Cookie middleware
const cookieMiddleware = (req, res, next) => {
    let visitsCount = req.cookies.visits || 0;
    visitsCount++;
    // ONE YEAR
    res.cookie('visits', visitsCount, { maxAge: 1000 * 60 * 60 * 24 * 365 });
    next();
}


// Session middleware
const sessionMiddleware = (req, res, next) => {
    let sessionId = req.cookies.sessionId || null;
    if (!sessionId) {
        sessionId = md5(uuidv4()); // md5 kad būtų trumpesnis
    }
    let session = fs.readFileSync('./data/session.json', 'utf8');
    session = JSON.parse(session);
    let user = session.find(u => u.sessionId === sessionId);
    if (!user) {
        user = {
            sessionId
        };
        session.push(user);
        session = JSON.stringify(session);
        fs.writeFileSync('./data/session.json', session);
    }
    req.user = user;
    res.cookie('sessionId', sessionId, { maxAge: 1000 * 60 * 60 * 24 * 365 });
    next();
};

// Messages middleware 

const messagesMiddleware = ( req, res, next) => {
    if(req.method === 'GET') {
        updateSession(req, 'message', null);
    } 

    next();

};



app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cookieMiddleware);
app.use(sessionMiddleware);
app.use(messagesMiddleware);


// Routes

// app.get('/admin', (req, res) => {

//     const data = {
//         pageTitle: 'Sąskaitų generavimas',                           NONO
//     };
//     const html = makeHtml(data, 'main');

//     res.send(html);
// });



app.get('/list', (req, res) => {

    let invclistData = fs.readFileSync('./data/inv-list.json', 'utf8');
    invclistData = JSON.parse(invclistData);

    const data = {
        pageTitle: 'Sąskaitų sąrašas',
        invclistData,
        message: req.user.message || null
    };
    const html = makeHtml(data, 'list');

    res.send(html);
});

app.get('/admin/top', (req, res) => {

    invclistData = fs.readFileSync('./data/inv-list.json', 'utf8');

    invclistData = JSON.parse(invclistData);

    const data = {
        pageTitle: 'pagr puslapio virsus',
        invclistData,
    }
});

// app.post('/admin/top', (req, res) => {

//     const {part3, part1, part2 } = req.body;

//     //will be validated later
//     let invclistData = {
//         part3,
//         part1,
//         part2,
//     };
//     console.log(part3)

//     invclistData = JSON.stringify(invclistData);
//     fs.writeFileSync('./data/inv-list.json', invclistData);

// updateSession(req, 'message', {text: 'puslapis atnaujintas', type: succes});

//     res.redirect(URL + 'admin/top');

// });


   

app.post('/top', (req, res) => {

    const {part1} = req.body;
    //will be validate later

    let invclistData = {
        part1,
    };
    
    invclistData = JSON.stringify(invclistData);
    fs.writeFileSync('./data/inv-list.json', invclistData);
    res.redirect('URL + admin/top');

});

app.get('/', (req, res) => {

    invclistData = fs.readFileSync('./data/inv-list.json', 'utf8');
    invclistData = JSON.parse(invclistData);

    const data = {
        pageTitle: 'Pagrindinis puslapis',
        invclistData
    };
    const html = makeHtml(data, 'main', false);

    res.send(html);
});






// Start server

const port = 3000;
app.listen(port, () => {
    console.log(`Serveris pasiruošęs ir laukia ant ${port} porto!`);
});