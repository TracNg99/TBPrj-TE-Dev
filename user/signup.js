document.addEventListener("DOMContentLoaded", () => {
  const infoTheme = document.createElement('div');
  infoTheme.id = 'welcome-container';
  infoTheme.style.position = "fixed"; 
  infoTheme.style.top = "0";         
  infoTheme.style.left = "0";        
  infoTheme.style.width = "100%";
  infoTheme.style.height = "100%";
  infoTheme.style.margin = "0";      
  infoTheme.style.padding = "0";     

  let fieldID = ["userFirstName", "userLasName", "userEmail", "userPassword", "userPhone", "userNotes"];
  let uploadInfoText = {action: "sign up", role: "user", password: "1234"};
  let dbFieldId = ["firstname", "lastname", "email", "password", "phone", "preferences"];
  let responseMessage = "";
  let responseWindow = "none"; 

  function renderPage(toggle, displaycontent) {
    infoTheme.innerHTML = `
    <div class="fixed inset-0 w-full h-full">
        <!-- Background Image -->
        <img src="https://assets.onecompiler.app/42yzz337k/42yzyxrg5/DALL%C2%B7E%202024-11-24%2000.25.50%20-%20A%20vibrant%20digital%20art%20image%20of%20a%20group%20of%20friends%20standing%20together%20and%20looking%20at%20the%20sunrise%20over%20Ha%20Long%20Bay.%20The%20view%20captures%20the%20stunning%20beauty.webp" 
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

            <!-- First Name Input -->
            <div class="mb-4">
                <label for="${fieldID[0]}" class="block text-gray-700 text-sm font-bold mb-2">First Name</label>
                <input id="${fieldID[0]}" 
                       type="text"
                       name="first"
                       autocomplete="given-name" 
                       placeholder="Enter your first name"
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            </div>

            <!-- Last Name Input -->
            <div class="mb-4">
                <label for="${fieldID[1]}" class="block text-gray-700 text-sm font-bold mb-2">Last Name</label>
                <input id="${fieldID[1]}" 
                       type="text"
                       name="last"
                       autocomplete="family-name" 
                       placeholder="Enter your last name"
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            </div>

            <!-- Email Input -->
            <div class="mb-4">
                <label for="${fieldID[2]}" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
                <input id="${fieldID[2]}" 
                       type="email"
                       name="email"
                       autocomplete="email" 
                       placeholder="Enter your email"
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            </div>

            <!-- Password Input -->
            <div class="mb-4">
                <label for="${fieldID[3]}" class="block text-gray-700 text-sm font-bold mb-2">Password</label>
                <input id="${fieldID[3]}" 
                       type="password"
                       name="password"
                       placeholder="Enter your password"
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            </div>

            <!-- Phone Input -->
            <div class="mb-4">
                <label for="${fieldID[4]}" class="block text-gray-700 text-sm font-bold mb-2">Phone</label>
                <input id="${fieldID[4]}" 
                       type="tel"
                       name="phone"
                       autocomplete="tel" 
                       placeholder="Enter your phone number"
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            </div>

            <!-- Preferences Input -->
            <div class="mb-6">
                <label for="${fieldID[5]}" class="block text-gray-700 text-sm font-bold mb-2">Preferences</label>
                <input id="${fieldID[5]}" 
                       type="text"
                       name="preferences"
                       placeholder="Enter your preferences"
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
    
    document.getElementById("uploadInfo").onclick = async() => { await uploadContent(); };
  } 
  
  function navigateTo(page) {
    window.location.href = page;
  }
  
  async function uploadContent() {
        for (let ii in fieldID) {
          uploadInfoText[dbFieldId[ii]] = document.getElementById(fieldID[ii]).value;
        }

        try {
          let response = await fetch("https://us-central1-travel-app-practice-441004.cloudfunctions.net/httpRouting_WebClientVer", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(uploadInfoText)
          });
          if (response.status !== 200) {
            console.log(response.status);
            responseMessage = await response.json;
            renderPage("block", responseMessage.message);
            throw new Error('Unable to fetch the data');
          } else {
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