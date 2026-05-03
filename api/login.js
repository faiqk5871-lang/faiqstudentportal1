const users = [];

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    try {
        const { email, password } = JSON.parse(event.body);
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            return { 
                statusCode: 200, 
                body: JSON.stringify({ 
                    success: true, 
                    user: { name: user.name, email: user.email },
                    token: 'demo-jwt-token'
                }) 
            };
        } else {
            return { 
                statusCode: 401, 
                body: JSON.stringify({ success: false, message: 'Invalid credentials' }) 
            };
        }
    } catch (error) {
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: error.message }) 
        };
    }
};
