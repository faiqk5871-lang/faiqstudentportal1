const users = [];

// In-memory storage (resets on each deployment - use database for production)
 exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    try {
        const { name, email, password } = JSON.parse(event.body);
        const existingUser = users.find(u => u.email === email);
        
        if (existingUser) {
            return { 
                statusCode: 400, 
                body: JSON.stringify({ success: false, message: 'Email already exists' }) 
            };
        }
        
        users.push({ name, email, password, createdAt: new Date().toISOString() });
        
        return { 
            statusCode: 200, 
            body: JSON.stringify({ success: true, message: 'Registration successful!' }) 
        };
    } catch (error) {
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: error.message }) 
        };
    }
};
