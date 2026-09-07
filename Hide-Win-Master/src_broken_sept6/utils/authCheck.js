const { net } = require('electron');
const storage = require('../storage');

async function validateSubscriptionWithAdmin() {
    return new Promise((resolve, reject) => {
        const credentials = storage.getCredentials();
        if (!credentials || !credentials.jwtToken || !credentials.hashkey) {
            return reject(new Error('No valid subscription token or hashkey found.'));
        }

        // Fetch backend URL from storage or fallback to localhost
        const backendUrl = storage.getPreference('backendUrl') || 'http://localhost:8000';
        
        const request = net.request({
            method: 'POST',
            url: `${backendUrl}/api/auth/validate-hash`,
            headers: {
                'Authorization': `Bearer ${credentials.jwtToken}`,
                'X-Session-Hashkey': credentials.hashkey,
                'Content-Type': 'application/json'
            }
        });

        request.on('response', (response) => {
            if (response.statusCode === 200) {
                resolve(true);
            } else {
                reject(new Error('Subscription validation failed. Hashkey rejected.'));
            }
        });

        request.on('error', (error) => {
            reject(new Error('Could not connect to Admin Backend: ' + error.message));
        });

        request.end();
    });
}

module.exports = { validateSubscriptionWithAdmin };
