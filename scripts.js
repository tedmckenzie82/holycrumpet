$(function() {
    $('input[type="date"]').prop('min', function(){
        return new Date().toJSON().split('T')[0];
    });
    
    var products = [
        {
            name: "The Holy Ones",
            cost: 1
        },
        {
            name: "The Beesting",
            cost: 10
        },
        {
            name: "The Virtuous Sinner",
            cost: 10
        },
        {
            name: "Sweet Potato Pecan Pie",
            cost: 10
        },
        {
            name: "Delivery",
            cost: 5
        }
    ];
    
    var cart = $('#cart');
    
    $('input[type="number"]').change(function(event) {
        var total = 0;
        var items = $('tr', cart);
        
        items.each(function() {
            var item = $(this);
            var index = items.index(item);
            var product = products[index];
            
            var priceComponent = $('.price', item);
            var quantityInput = $('.quantity input', item);
            var quantity = quantityInput.val();
            var restrictedQuantity = quantity || 1;
            
            if (quantity) {
                var minimum = parseInt(quantityInput.attr('min'));
                var maximum = parseInt(quantityInput.attr('max'));
                restrictedQuantity = Math.min(Math.max(quantity, minimum), maximum);
                quantityInput.val(restrictedQuantity);
            }
            
            if (product) {
                var itemTotal = restrictedQuantity * product.cost;
                total += itemTotal;
                priceComponent.text('$' + itemTotal.toFixed(2));
            } else {
                priceComponent.text('$' + total.toFixed(2));
            }
        });
    });
    
    function extractOrderData(data) {
        return {
            customer: {
                name: data.name,
                address: {
                    number: data.street_no,
                    street: data.street,
                    suburb: data.suburb,
                    postcode: data.postcode
                },
                email: data.email,
                phoneNumber: data.phone
            },
            date: data.date + " " + data.time,
            lineItems: [
                { sku: "PRD001", quantity: data.beesting },
                { sku: "PRD002", quantity: data.crumpet }
            ],
            quotedPrice: $('#quoted-price').text()
        };
    }
    
    $('#order-form').submit(function(event) {
        event.preventDefault();
        var data = {};
        $(this).serializeArray().map(function(x){data[x.name] = x.value;});
        var orderData = extractOrderData(data);
        
        console.log(orderData);
        
        $.post("localhost:8080/order", data, function() {
            console.log('SAVED');
        });
        
        return false;
    });

    $('a.enquire').click(function() {
        ga('send', 'event', 'Link', 'Click', 'Enquire');
        return true;
    });
});
