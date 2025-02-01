const express = require('express');
const app = express();
const URL = 'http://localhost:3000/'
const fs = require('fs');
const handlebars = require('handlebars');
const bodyParser = require('body-parser');
const apiUrl = "https://in3.dev/inv/";
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
const md5 = require('md5');


let invoices = fs.readFileSync('./data/invoices.json', 'utf8');
invoices = JSON.parse(invoices);



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




// Functions

function newInv(newData) {
    Object.assign(newData, { subTotal: 0, vat: 0, grandTotal: 0, totalDiscounts: 0 });

    newData.items.forEach(item => {
        if (item.discount.type === 'fixed') {
            item.discount.Eur = item.discount.value;
            item.discount.P = (item.discount.value * 100) / (item.price * item.quantity);
        } else if (item.discount.type === 'percentage') {
            item.discount.P = item.discount.value;
            item.discount.Eur = (item.price * item.quantity) * (item.discount.P / 100);
        } else {
            item.discount.Eur = 0;
            item.discount.P = 0;
        }

        item.itemTotal = item.quantity * item.price;
        item.itemDiscountedTotal = (item.itemTotal - item.discount.Eur).toFixed(2);
        newData.subTotal += item.itemTotal;
        newData.totalDiscounts += item.discount.Eur;

        item.discount.Eur = `-${item.discount.Eur.toFixed(2)}€`;
        item.discount.P = `(-${item.discount.P.toFixed(2)}%)`;
    });

    newData.vat = ((newData.subTotal + newData.shippingPrice) * 0.21).toFixed(2);
    newData.grandTotal = (newData.subTotal - newData.totalDiscounts + newData.shippingPrice + parseFloat(newData.vat)).toFixed(2);
    
    newData.subTotal = newData.subTotal.toFixed(2);
    newData.totalDiscounts = newData.totalDiscounts.toFixed(2);
    newData.shippingPrice = newData.shippingPrice.toFixed(2);

    fs.writeFileSync('./data/inv-list.json', JSON.stringify(newData), 'utf8');
}

function editedInv(newData) {
    Object.assign(newData, { subTotal: 0, vat: 0, grandTotal: 0, totalDiscounts: 0 });

    newData.items.forEach(item => {
        item.itemTotal = item.quantity * item.price;
        item.itemDiscountedTotal = (item.itemTotal - parseFloat(item.discount.Eur)).toFixed(2);
        newData.subTotal += item.itemTotal;
        newData.totalDiscounts += parseFloat(item.discount.Eur);

        item.discount.Eur = `-${parseFloat(item.discount.Eur).toFixed(2)}€`;
        item.discount.P = `(-${parseFloat(item.discount.P).toFixed(2)}%)`;
    });

    newData.vat = ((newData.subTotal + parseFloat(newData.shippingPrice)) * 0.21).toFixed(2);
    newData.grandTotal = (newData.subTotal - newData.totalDiscounts + parseFloat(newData.shippingPrice) + parseFloat(newData.vat)).toFixed(2);
    
    newData.subTotal = newData.subTotal.toFixed(2);
    newData.totalDiscounts = newData.totalDiscounts.toFixed(2);
    // newData.shippingPrice = newData.shippingPrice.toFixed(2);

    let invoices = JSON.parse(fs.readFileSync('./data/invoices.json', 'utf8'));
    invoices.items = invoices.items.filter(inv => inv.number !== newData.number);
    invoices.items.push(newData);

    fs.writeFileSync('./data/invoices.json', JSON.stringify({ items: invoices.items }), 'utf8');
}





function addItem(newData) {
   
    let fileContent = {};
    const oldData = fs.readFileSync('./data/invoices.json', 'utf8'); 
    fileContent = oldData ? JSON.parse(oldData) : {}; 

    if (!fileContent.items) {
        fileContent.items = [];
    }

    fileContent.items.push(newData);

    fs.writeFileSync('./data/invoices.json', JSON.stringify(fileContent), 'utf8');
    console.log('New item added successfully!');
}





app.get('/', (req, res) => {

   
    const data = {
        pageTitle: 'Pagrindinis puslapis',
       
    };
   

    const html = makeHtml(data, 'main');

    res.send(html);
});




app.get('/list', (req, res) => {

    let invclistData = fs.readFileSync('./data/invoices.json', 'utf8');
    invclistData = JSON.parse(invclistData);

    const data = {
        pageTitle: 'Sąskaitų sąrašas',
        invclistData,
        URL,
        message: req.user.message || null,
        
    };

    

    const html = makeHtml(data, 'list');

    res.send(html);
});

// Create 

app.get('/new', (req, res) => {

    async function getData() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
 
            const json = await response.json();
            newInv(json);

            res.redirect(`${URL}create`);    
 
        } catch (error) {
            console.error('Error:', error);
        }
    }
    updateSession(req, 'message', {text: 'Nauja sąskaita sugeneruota', type: 'succes'});
    getData();

});

app.get('/create', (req, res) => { 

    let invclistData = fs.readFileSync('./data/inv-list.json', 'utf8');
    invclistData = JSON.parse(invclistData);

    const data = {
        pageTitle: 'Nauja sąskaita',
        invclistData,
        URL,
        message: req.user.message || null
        
    };
    
    const html = makeHtml(data, 'create');
    
    res.send(html);
});

// STORE 

app.get('/save', (req, res) => {

    let invclistData = fs.readFileSync('./data/inv-list.json', 'utf8');
    invclistData = JSON.parse(invclistData);



    addItem(invclistData);

    updateSession(req, 'message', {text: 'Sąskaita išsaugota', type: 'succes'});

    res.redirect(`${URL}list`);


});

//READ

app.get('/read/:number', (req, res) => {
    let invoices = fs.readFileSync('./data/invoices.json', 'utf8');
    invoices = JSON.parse(invoices);

    const invclistData = invoices.items.find(invoisas => invoisas.number === req.params.number);
    

    const data = {
        pageTitle: 'Sąskaitos peržiūra',
        invclistData,
        URL,
        
    };
    
    const html = makeHtml(data, 'read');

    // updateSession(req, 'message', {text: 'Sąskaita peržiūrima', type: 'succes'});

    res.send(html);
});


 // DELETE

 app.get('/delete/:number', (req, res) => {
    let invoice = fs.readFileSync('./data/invoices.json', 'utf8');
    invoice = JSON.parse(invoice);

    const invclistData = invoice.items.find(invclistData => invclistData.number === req.params.number);



    const data = {
        pageTitle: invclistData.number + ' sąskaitos trynimas',
        invclistData,
        URL,
    };

    const html = makeHtml(data, 'delete');

    res.send(html);
});

app.get('/destroy/:number', (req, res) => {
    let invclistData = fs.readFileSync('./data/invoices.json', 'utf8');
    invclistData = JSON.parse(invclistData);

    let fileContent = {};


    const invoice = invclistData.items.find(invoice => invoice.number === req.params.number);

    const filteredInvoice = invclistData.items.filter((inv) => inv !== invoice);

    fileContent.items = filteredInvoice;
    fs.writeFileSync('./data/invoices.json', JSON.stringify(fileContent), 'utf8');

    updateSession(req, 'message', {text: 'Sąskaita ištrinta', type: 'succes'});

    res.redirect(`${URL}list`);
});


// EDIT


app.get('/edit/:number', (req, res) => {
    let invoices = fs.readFileSync('./data/invoices.json', 'utf8');
    invoices = JSON.parse(invoices);

    const invclistData = invoices.items.find(invclistData => invclistData.number === req.params.number);
    invclistData.items.map(item => {
        if (item.discount.P) {
            item.discount.P = item.discount.P.slice(2, -2)
        }
    });

    

    const data = {
        pageTitle: invclistData.number + ' sąskaitos redagavimas',
        invclistData,
        URL,

    };

    const html = makeHtml(data, 'edit');

    res.send(html);

});

app.post('/update/:id', (req, res) => {
    try {
        
        let invoices = fs.readFileSync('./data/invoices.json', 'utf8');
        invoices = JSON.parse(invoices);

        const id = req.params.id;
        const invclistData = invoices.items.find(invclistData => invclistData.number === id);

        if (!invclistData) {
            return res.status(404).send("Sąskaita nerasta.");
        }

        let { quantity, discount_eur, discount_p } = req.body;

        
        quantity = quantity.map(qty => parseInt(qty) || 0);
        discount_eur = discount_eur.map(d => parseFloat(d) || 0);
        discount_p = discount_p.map(d => parseFloat(d) || 0);

        invclistData.items.forEach((item, i) => {
            item.quantity = quantity[i];

           
            if (discount_eur[i] === 0 && discount_p[i] !== 0) {
                item.discount.Eur = (item.price * item.quantity) * (discount_p[i] / 100);
            } else {
                item.discount.Eur = discount_eur[i];
            }

          
            if (item.discount.Eur !== 0 && discount_p[i] === 0) {
                item.discount.P = (item.discount.Eur * 100) / (item.price * item.quantity);
            } else {
                item.discount.P = discount_p[i];
            }
        });

        
        updateSession(req, 'message', { text: 'Pakeista sąskaita išsaugota', type: 'success' });

        
        editedInv(invclistData);

      
        fs.writeFileSync('./data/invoices.json', JSON.stringify(invoices, null, 2), 'utf8');
        res.redirect(URL + 'edit/' + id);
    } catch (err) {
        console.error("Klaida atnaujinant sąskaitą:", err);
        res.status(500).send("Nepavyko atnaujinti sąskaitos.");
    }
});



// Start server

const port = 3000;
app.listen(port, () => {
    console.log(`Serveris pasiruošęs ir laukia ant ${port} porto!`);
});