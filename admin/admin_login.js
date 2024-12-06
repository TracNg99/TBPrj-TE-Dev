document.addEventListener('DOMContentLoaded', function() {
    if (window.businessEmail !== 'default value'|| window.businessName !== 'default value' || window.serviceID !== 'default value') {
        window.updateBusinessEmail('default value');
        window.updateServID('default value');
        window.updateBusinessName('default value');
    }


    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const requestURL = 'https://us-central1-travel-app-practice-441004.cloudfunctions.net/httpRouting_WebClientVer';

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        let uploadInfoText = {
            action: "sign in",
            role: "partner",
            email: email,
            password: password
        };

        try {
            const response = await fetch(requestURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(uploadInfoText)
            });

            const responseMessage = await response.json();

            console.log("Received response:", response.status, responseMessage.message);
            
            
            if (response.status !== 200) {
                console.log("Received response:", response.status, responseMessage.message);
                renderPage('block', responseMessage.message);
            } else {
                window.updateBusinessEmail(uploadInfoText.email);
                window.location.href = 'admin_portal.html';
            }
        } catch (error) {
            console.error('Error:', error);
            renderPage('block', 'An error occurred. Please try again.');
        }
    });

    function renderPage(display, message) {
        errorMessage.style.display = display;
        errorMessage.textContent = message;
    }
});
