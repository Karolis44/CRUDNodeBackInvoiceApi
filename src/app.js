

if (document.querySelector('[data-msg]')) {
    const msg = document.querySelector('[data-msg]');
    setTimeout(_ => {
        msg.remove();
    }, 3000);
}
const items = document.querySelectorAll('[data-item]');

const itemTotalUpdater = _ => {
    items.forEach((item) => {
        const qtyEl = item.querySelector('[data-item-qty]');
        const discEurEl = item.querySelector('[data-item-discount-eur]');
        const discPEl = item.querySelector('[data-item-discount-p]');
        const priceEl = item.querySelector('[data-item-price]');
        const itemTotal = item.querySelector('[data-item-discounted-total]');
        
        let qty = parseInt(qtyEl.value);
        const price = parseFloat(priceEl.innerText);

        let discEur = parseFloat(discEurEl.value);
        let discP = parseFloat(discPEl.value);

        const updateItemTotal = () => {
            let total;
            if (discEur && discEur > 0) {
                total = qty * price - discEur;
            } else {
                total = qty * price;
            }
            total = total > 0 ? total : 0;

            discP = (discEur * 100 / (price * qty));
            if (discP <= 0 || !discP) {
                discP = '';
            } else if (discP > 100) {
                discEur = qty * price;
                discP = 100;
                discP = parseFloat(discP).toFixed(2);
            }
            if (!discEur) {
                discEur = '';
            } else {
                discEur = parseFloat(discEur).toFixed(2);
            };

            discEurEl.value = discEur;
            discPEl.value = discP;
            itemTotal.innerText = total.toFixed(2);
        }

        qtyEl.addEventListener('input', (e) => {
            qty = parseInt(qtyEl.value);
            updateItemTotal();
            totalsUpdater();
        });

        discEurEl.addEventListener('input', (e) => {
            discEur = parseFloat(discEurEl.value);
            updateItemTotal();
            totalsUpdater();
        });

        discPEl.addEventListener('input', (e) => {
            discP = parseFloat(discPEl.value);
            discEur = (price * qty - (price * qty * (1 - discP / 100)));
            updateItemTotal();
            totalsUpdater();
        });
    });
};

const totalsUpdater = _ => {
    let subtotal = 0;
    let vat = 0;
    let totalDiscounts = 0;

    const subtotalHtml = document.querySelector('[data-pre-total]');
    let shipping = document.querySelector('[data-shipping-price]').innerText;
    shipping = parseFloat(shipping);

    const vatHtml = document.querySelector('[data-vat]');
    const totalDiscountsHtml = document.querySelector('[data-total-discounts]');
    const grandTotalHtml = document.querySelector('[data-total-final]');

    items.forEach(item => {
        let qty = parseInt(item.querySelector('[data-item-qty]').value);
        const price = parseFloat(item.querySelector('[data-item-price]').innerText);
        let discEur = parseFloat(item.querySelector('[data-item-discount-eur]').value);

        if (!discEur) {
            discEur = 0;
        };

        let itemTotal = qty * price;
        subtotal += itemTotal;
        totalDiscounts += discEur;
    });

    vat = ((subtotal + shipping) * 0.21);

    subtotalHtml.innerText = subtotal.toFixed(2);
    vatHtml.innerText = vat.toFixed(2);
    totalDiscountsHtml.innerText = totalDiscounts.toFixed(2);
    grandTotalHtml.innerText = (subtotal + shipping + vat - totalDiscounts).toFixed(2);
}


const init = _ => {
    itemTotalUpdater();
};

init();
