document.addEventListener("DOMContentLoaded", () => {
    if (window.signInEmail !== 'default value'|| window.provider !== 'default value' || window.serviceID !== 'default value') {
        window.updateUserEmail('default value');
        window.updateServID('default value');
        window.updateProvider('default value');
    }
    
    const appContainer = document.getElementById('app');
    //let valueFromQRCode;
    let urlParams;

    
    let fID = ["email", "password"];
    let uploadInfoText = {
        email: "", 
        password: "", 
        action: "sign in", 
        role: "user"
    };

    let serverURL = "https://us-central1-travel-app-practice-441004.cloudfunctions.net/httpRouting_WebClientVer";
    let responseMessage = "";
    let responseWindow = "none";
    
    function renderPage(toggle, mess) {
        appContainer.innerHTML = `
            <div class="relative w-full min-h-screen">
                <!-- Background Image -->
                <img src="https://assets.onecompiler.app/42yzz337k/42yzyxrg5/DALL%C2%B7E%202024-11-24%2000.25.50%20-%20A%20vibrant%20digital%20art%20image%20of%20a%20group%20of%20friends%20standing%20together%20and%20looking%20at%20the%20sunrise%20over%20Ha%20Long%20Bay.%20The%20view%20captures%20the%20stunning%20beauty.webp" 
                     alt="Background" 
                     class="absolute inset-0 w-full h-full object-cover opacity-90">
                
                <!-- Back Button 
                <button id="prevPage" 
                        class="absolute top-4 left-4 bg-primary text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-200 flex items-center">
                    <span class="mr-2">&#10094;</span> Back to Cover
                </button> -->

                <!-- Login Form -->
                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                            w-full max-w-md bg-white rounded-lg shadow-xl p-8">
                    <h2 class="text-2xl font-bold text-primary text-center mb-6">User Login</h2>

                    ${toggle === 'block' ? `
                        <div class="bg-primary text-white p-4 rounded-lg mb-4">
                            ${mess}
                        </div>
                    ` : ''}

                    <!-- Email Input -->
                    <div class="mb-4">
                        <label for="${fID[0]}" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input id="${fID[0]}" 
                               type="email"
                               autocomplete="email" 
                               placeholder="Enter your email"
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    </div>

                    <!-- Password Input -->
                    <div class="mb-6">
                        <label for="${fID[1]}" class="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input id="${fID[1]}" 
                               type="password"
                               autocomplete="current-password" 
                               placeholder="Enter your password"
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    </div>

                    <!-- Login Button -->
                    <button id="Login" 
                            class="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200">
                        Login
                    </button>

                    <!-- Register Link -->
                    <p class="mt-4 text-center">
                        <a href="signup.html" 
                           class="text-primary hover:text-blue-600 transition-colors duration-200">
                            Have not registered yet? Join us!
                        </a>
                    </p>
                </div>
            </div>
        `;
        
        document.getElementById("Login").onclick = async() => { await uploadContent(); };
        //document.getElementById("prevPage").onclick = () => navigateTo('index.html');
        urlParams = new URLSearchParams(window.location.search);
        window.updateServID(urlParams.get('serviceId') || '');
    } 
    
    function navigateTo(page) {
        window.location.href = page;
    }
    
    async function uploadContent() {
        // Collect form data
        fID.forEach(id => {
            uploadInfoText[id] = document.getElementById(id).value;
        });
        
        try {
            const response = await fetch(serverURL, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(uploadInfoText)
            });

            responseMessage = await response.json();
            responseWindow = 'block';

            if (!response.ok) {
                console.error("Error:", response.status, responseMessage.message);
                renderPage(responseWindow, responseMessage.message);
                throw new Error('Unable to fetch the data');
            }

            console.log("Recieved response:", response.status, responseMessage.message);
            window.updateUserEmail(uploadInfoText.email);
            if (response.status !== 200){
                console.log("Recieved response:", response.status, responseMessage.message);
                renderPage('block', responseMessage.message);
            } else {
                if (window.serviceID != ''){
                    navigateTo('cover.html');
                } else {
                    navigateTo('userportal.html');
                }
                
            }
            

        } catch (error) {
            console.error('Error:', error);
            renderPage('block', 'An error occurred. Please try again.');
        }
    }

    function initPage() {
        renderPage('none', '');
    }

    initPage();
});