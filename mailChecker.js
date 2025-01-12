const dns = require('dns');

function checkDomain(email, callback) {
    const domain = email.split('@')[1];
    dns.resolveMx(domain, (err, addresses) => {
        if (err || addresses.length === 0) {
            callback('Invalid email domain');
        } else {
            callback('Valid email domain');
        }
    });
}

module.exports = { checkDomain };
