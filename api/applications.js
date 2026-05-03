const applications = [];

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    try {
        const body = JSON.parse(event.body);
        const applicationData = {
            workshopId: body.workshopId,
            workshopTitle: body.workshopTitle || 'Unknown Workshop',
            name: body.name,
            fatherName: body.fatherName,
            phone: body.phone,
            email: body.email,
            class: body.class,
            institute: body.institute,
            userId: body.userId || 'demo-user',
            status: 'Pending',
            createdAt: new Date().toISOString()
        };

        applications.push(applicationData);
        
        return { 
            statusCode: 200, 
            body: JSON.stringify({ success: true, message: 'Application submitted successfully!' }) 
        };
    } catch (error) {
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: error.message }) 
        };
    }
};
