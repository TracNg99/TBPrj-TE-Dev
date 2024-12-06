document.addEventListener("DOMContentLoaded", () => {
  if (window.signInEmail !== 'default value'|| window.provider !== 'default value' || window.serviceID !== 'default value') {
    window.updateUserEmail('default value');
    window.updateServID('default value');
    window.updateProviderID('default value');
  }
  
  const infoTheme = document.createElement('div');
  infoTheme.id = 'welcome-container';
  infoTheme.style.position = "fixed"; 
  infoTheme.style.top = "0";         
  infoTheme.style.left = "0";        
  infoTheme.style.width = "100%";
  infoTheme.style.height = "100%";
  infoTheme.style.margin = "0";      
  infoTheme.style.padding = "0";     

  let fieldID = ["accountName","userEmail", "userPassword", "userFirstName", "userLasName"];
  let uploadInfoText = {action: "sign up", role: "user", password: ""};
  let dbFieldId = ["username", "email", "password", "firstname", "lastname"];
  let responseMessage = "";
  let responseWindow = "none"; 
  let serverURL = "https://us-central1-travel-app-practice-441004.cloudfunctions.net/httpRouting_WebClientVer";

  function renderPage(toggle, displaycontent) {
    infoTheme.innerHTML = `
    <div class="fixed inset-0 w-full h-full">
        <!-- Background Image -->
        <img src="background.jpg" 
             alt="Background" 
             class="absolute inset-0 w-full h-full object-cover opacity-90">

        <!-- Signup Form -->
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    w-full max-w-md bg-white rounded-lg shadow-xl p-8">
            <h2 class="text-2xl font-bold text-primary text-center mb-6">Create Account</h2>

            ${toggle === 'block' ? `
                <div class="bg-primary text-white p-4 rounded-lg mb-4">
                    ${displaycontent}
                </div>
            ` : ''}

            <!-- Username Input -->
            <div class="mb-4">
                <label for="${fieldID[0]}" class="block text-gray-700 text-sm font-bold mb-2">Username</label>
                <input id="${fieldID[0]}" 
                       type="username"
                       name="username"
                       placeholder="Enter your username"
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            </div>

            <!-- Email Input -->
            <div class="mb-4">
                <label for="${fieldID[1]}" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
                <input id="${fieldID[1]}" 
                       type="email"
                       name="email"
                       autocomplete="email" 
                       placeholder="Enter your email"
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            </div>

            <!-- Password Input -->
            <div class="mb-4">
                <label for="${fieldID[2]}" class="block text-gray-700 text-sm font-bold mb-2">Password</label>
                <input id="${fieldID[2]}" 
                       
                       type="password"
                       name="password"
                       placeholder="Enter your password"
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            </div>

            <!-- Confirm Password Input -->
            <div class="mb-4">
                <label for="confirmPassword" class="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
                <input id="confirmPassword" 
                       type="password"
                       name="password"
                       placeholder="Verify your password"
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            </div>

            <!-- First Name Input -->
            <div class="mb-4">
                <label for="${fieldID[3]}" class="block text-gray-700 text-sm font-bold mb-2">First Name</label>
                <input id="${fieldID[3]}" 
                       type="text"
                       name="first"
                       autocomplete="given-name" 
                       placeholder="Enter your first name"
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            </div>

            <!-- Last Name Input -->
            <div class="mb-4">
                <label for="${fieldID[4]}" class="block text-gray-700 text-sm font-bold mb-2">Last Name</label>
                <input id="${fieldID[4]}" 
                       type="text"
                       name="last"
                       autocomplete="family-name" 
                       placeholder="Enter your last name"
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            </div>

            <!-- Sign Up Button -->
            <button id="uploadInfo" 
                    class="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200">
                Create Account
            </button>

            <!-- Login Link -->
            <p class="mt-4 text-center">
                <a href="index.html" 
                   class="text-primary hover:text-blue-600 transition-colors duration-200">
                    Already have an account? Log in here
                </a>
            </p>
        </div>
    </div>
    `;
    
    const username = document.getElementById('accountName').value;
    const email = document.getElementById('userEmail').value;
    
    const password = document.getElementById('userPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword && password !== "" && confirmPassword !== "") {
      renderPage('block', 'Passwords do not match');
      return;
    }


    document.getElementById("uploadInfo").onclick = async() => { await uploadContent(); };

  } 
  
  function navigateTo(page) {
    window.location.href = page;
  }
  
  async function uploadContent() {

        for (let ii in fieldID) {
          uploadInfoText[dbFieldId[ii]] = document.getElementById(fieldID[ii]).value;

        if (!uploadInfoText[dbFieldId[ii]] && dbFieldId[ii] !== "firstname" && dbFieldId[ii] !== "lastname") {
          let displayField = dbFieldId[ii][0].toUpperCase() + dbFieldId[ii].substring(1);
          renderPage('block', `${displayField} cannot be empty`);
          return;
        }
        }

        try {
          let response = await fetch(serverURL, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(uploadInfoText)
          });
          if (response.status !== 200) {
            alert("Registration attempt failed!");
            console.log(response.status);
            responseMessage = await response.json;
            renderPage("block", responseMessage.message);
            throw new Error('Unable to fetch the data');
          } else {
            alert("Your account has been created!");
            responseMessage = await response.json;
            console.log("HTTPS response status code:",response.status);
            console.log("HTTPS response content:",responseMessage.message);
            renderPage("block", responseMessage.message);
          }
          
        } catch (error) {
            console.log(error);
        }       
  }
  
  async function initPage() {
    renderPage(responseWindow, uploadInfoText['email']);
  }
  
  document.body.appendChild(infoTheme);
  initPage();
});