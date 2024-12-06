document.addEventListener('DOMContentLoaded', function() {
    if (window.businessEmail !== 'default value'|| window.businessName !== 'default value' || window.serviceID !== 'default value') {
        window.updateBusinessEmail('default value');
        window.updateServID('default value');
        window.updateBusinessName('default value');
    }
    const signupForm = document.getElementById('signupForm');
    const errorMessage = document.getElementById('errorMessage');
    const serverURL = 'https://us-central1-travel-app-practice-441004.cloudfunctions.net/httpRouting_WebClientVer';

    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const businessName = document.getElementById('businessName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const businessType = document.getElementById('businessType').value;

        if (password !== confirmPassword) {
            renderPage('block', 'Passwords do not match');
            return;
        }

        let uploadInfoText = {
            action: "sign up",
            role: "partner",
            email: email,
            password: password,
            businessName: businessName,
            businessType: businessType
        };

        try {
            const response = await fetch(serverURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(uploadInfoText)
            });

            const responseMessage = await response.json();

            if (response.status !== 200) {
                console.log("Received response:", response.status, responseMessage.message);
                renderPage('block', responseMessage.message);
            } else {
                alert("Your account has been created!");
                window.location.href = 'index.html';
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
