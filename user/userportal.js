document.addEventListener("DOMContentLoaded", async () => {
    
    const portalTheme = document.createElement('div');
    //portalTheme.id = 'portal-container';
    //portalTheme.style.position = "relative";
    //portalTheme.style.width = "100%";
    //portalTheme.style.height = "100%";
    
    
    // State management
    let currentSection = 'profile';
    let serverURL = "https://us-central1-travel-app-practice-441004.cloudfunctions.net/httpRouting_WebClientVer";
    let cells = [];
    let history;
    let profile;

    // Functions
    function renderPage() {
        portalTheme.innerHTML = `
            <!-- Top Bar -->
    <div class="fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-50 flex items-center px-4">
        <!-- Sidebar Toggle -->
        <button id="sidebarToggle" class="p-2 hover:bg-gray-100 rounded-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
        </button>

        <!-- Search Bar -->
        <div class="flex-1 max-w-2xl mx-auto">
            <div class="relative">
                <input type="text" 
                       placeholder="Search features and content... (Placeholder for browse feature)" 
                       class="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary">
                <svg class="w-5 h-5 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
            </div>
        </div>
    </div>

    <!-- Sidebar -->
    <div id="sidebar" class="fixed pt-14 top-0 left-0 h-full w-64 bg-white shadow-lg transform -translate-x-full transition-transform duration-200 z-40">
        <!-- Home Link -->
        <div class="p-4 border-b">
            <a href="index.html" class="flex items-center space-x-2 text-primary hover:text-blue-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                <span class="font-semibold">Home</span>
            </a>
        </div>

        <!-- Navigation Links -->
        <nav class="p-4 space-y-2">
            <button id="profileBtn" class="w-full text-left p-2 rounded-lg hover:bg-gray-100 flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <span>Profile</span>
            </button>
            <button id="challengesBtn" class="w-full text-left p-2 rounded-lg hover:bg-gray-100 flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
                <span>Challenges</span>
            </button>
            <button id="activityBtn" class="w-full text-left p-2 rounded-lg hover:bg-gray-100 flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
                <span>Activity</span>
            </button>
            <button id="settingsBtn" class="w-full text-left p-2 rounded-lg hover:bg-gray-100 flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span>Settings</span>
            </button>
            <button id="logoutBtn" class="w-full text-left p-2 rounded-lg hover:bg-gray-100 flex items-center space-x-2 text-red-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                <span>Logout</span>
            </button>
        </nav>
    </div>

    <!-- Main Content -->
    <div class="pt-16 ml-0 min-h-screen transition-all duration-200">
        <!-- Profile Section -->
        <div id="profileSection" class="p-6 max-w-4xl mx-auto">
            <div class="bg-white rounded-lg shadow-lg p-6">
                <h2 class="text-2xl font-bold text-primary mb-6">Profile Information</h2>
                <div id="profileContent" class="space-y-4">
                    ${renderProfile(profile)}
                </div>
            </div>
        </div>

        <!-- Challenges Section -->
        <div id="challengesSection" class="hidden p-6">
            <div class="bg-white rounded-lg shadow-lg p-6">
                <h2 class="text-2xl font-bold text-primary mb-6">PICK YOUR CHALLENGE</h2>
                <div id="challengesContent" class="space-y-4">
                    ${renderChallenges(cells)}
                </div>
            </div>
        </div>

        <!-- Activity Section -->
        <div id="activitySection" class="hidden p-6 max-w-4xl mx-auto">
            <div class="bg-white rounded-lg shadow-lg p-6">
                <h2 class="text-2xl font-bold text-primary mb-6">Activity</h2>
                ${renderHistory(history)}
            </div>
        </div>

        <!-- Settings Section -->
        <div id="settingsSection" class="hidden p-6 max-w-4xl mx-auto">
            <div class="bg-white rounded-lg shadow-lg p-6">
                <h2 class="text-2xl font-bold text-primary mb-6">Settings</h2>
                <p class="text-gray-500">Coming soon...</p>
            </div>
        </div>
    </div>
        `;
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('-translate-x-full');
        });

        // Navigation buttons
        document.getElementById('profileBtn').onclick = () => showSection('profile');
        document.getElementById('challengesBtn').onclick = () => showSection('challenges');
        document.getElementById('activityBtn').onclick = () => showSection('activity');
        document.getElementById('settingsBtn').onclick = () => showSection('settings');
        document.getElementById('logoutBtn').onclick = () => logout();
        document.getElementById('saveProfile').onclick = updateProfile;

        // Add event listeners
        cells.forEach((_, index) => {
            document.getElementById(`goToItem${index}`).onclick = () => itemSelect(index);
        });
    }

    function showSection(section) {
        // Hide all sections
        ['profile', 'challenges', 'activity', 'settings'].forEach(s => {
            document.getElementById(`${s}Section`).classList.add('hidden');
        });
        
        // Show selected section
        document.getElementById(`${section}Section`).classList.remove('hidden');
        currentSection = section;

        // Close sidebar on mobile
        if (window.innerWidth < 768) {
            document.getElementById('sidebar').classList.add('-translate-x-full');
        }
    }

    async function fetchUserProfile() {
        //console.log(window.signInEmail);
        let uploadInfoText = {
           action: "show profile",
           collections: "user",
           email: `${window.signInEmail}`,
        };
        try {
            const response = await fetch(serverURL, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(uploadInfoText)
            });

            let responseMessage = await response.json();

            if (!response.ok) {
                console.error("Error:", response.status);
                //renderPage(responseWindow, responseMessage.message);
                throw new Error('Unable to fetch the data');
            }

            console.log("Recieved response:", response.status);
            if (response.status == 200){
                profileNewOrder = {
                    username: responseMessage.data.username,
                    email: responseMessage.data.email,
                    firstname: responseMessage.data.firstname,
                    lastname: responseMessage.data.lastname,
                    facebook: responseMessage.data.fblink,
                    instagram: responseMessage.data.xlink,
                    x: responseMessage.data.xlink,
                    phone: responseMessage.data.phone
                }
                return profileNewOrder;
            }
            

        } catch (error) {
            console.error('Error:', error);
            //renderPage('block', 'An error occurred. Please try again.');
        }
    }

    function renderProfile(profile) {
        return `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${Object.entries(profile).map(([key, value]) => `
                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700">${key.charAt(0).toUpperCase() + key.slice(1)}</label>
                        <input type="text" 
                               value="${value}" 
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                               data-field="${key}">
                    </div>
                `).join('')}
            </div>
            <button id="saveProfile" 
                    class="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">
                Save Changes
            </button>
        `; 
    }

    async function updateProfile() {
        const inputs = document.querySelectorAll('#profileContent input');
        const updatedProfile = { 
                                action: "update profile",
                                collections: "user",
                                };
        inputs.forEach(input => {
            updatedProfile[input.dataset.field] = input.value;
        });

        try {
            const response = await fetch(serverURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProfile)
            });
        //'Authorization': `Bearer ${localStorage.getItem('token')}`
            if (!response.ok) throw new Error('Failed to update profile');
            
            // Show success message
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    }


    async function fetchChallengesContent() {
        let uploadInfoText = {
            action: "get service", 
            collections: "services", 
            searchField: "serviceID",
            value: "service tracker"
        };
        try {
          const response = await fetch(serverURL, {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(uploadInfoText)
          });
    
          if (!response.ok) {
            throw new Error('Unable to fetch the data');
          }
    
          responseMessage = await response.json();
          console.log("HTTPS response status code:", response.status);
          console.log("HTTPS response content:", responseMessage.message);
          console.log(responseMessage.data[0].serviceID);
          //console.log(responseMessage.data[0].phototour);
          //renderChallenges(responseMessage.data.phototour)
          return responseMessage.data[0].phototour;
        } catch (error) {
          console.error(error);
        }
    }

    function renderChallenges(cells) {
        return`
            <div class="mt-8 grid grid-cols-2 gap-4">
                ${cells.map((item, index) => `
                    <div id="goToItem${index}" class="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:scale-105 cursor-pointer">
                      <img src="${item.imageurl}" alt="${item.title}" class="w-full h-48 object-cover">
                      <div class="p-4">
                        <h3 class="text-lg font-bold text-primary text-center">${item.title}</h3>
                      </div>
                    </div>
                  `).join('')}
            </div>
        `;
    }

    async function fetchHistoryData() {
        try {
            const response = await fetch(serverURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: "get service",
                    collections: "booking",
                    searchField: "useremail",
                    value: window.signInEmail
                })
            });
    
            const responseData = await response.json();
            if (response.status === 200) {
                //updateDashboard(responseData.data);
                //return responseData.data;
                return responseData.data;
                //console.log(dashboardData);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    }

    function challengeListHistory(challenges) {
        // Update active challenges list
        const challengesList = document.createElement('div');
        challengesList.innerHTML = '';
        if (challenges && challenges.length > 0) {
            console.log(challenges.length);
            challenges.forEach(challenge => {
                const challengeCard = document.createElement('div');
                //challengeCard.className = 'bg-white p-4 rounded-lg shadow';
                challengeCard.innerHTML = `
                <div class="bg-white p-4 rounded-lg shadow">
                    <h4 class="font-bold text-lg">${challenge.serviceID}</h4>
                    <p class="pt-3 text-gray-600 text-sm">
                        <span class="font-semibold">Status: </span>
                        ${'images' in challenge? 'Completed' : 'In progress'}
                    </p>
                    <p class="pt-3 text-gray-600 text-sm">
                        <span class="font-semibold">Link to Reels: </span>
                        ${challenge.videoUrl || 'Your video is being prepared!'}
                    </p>
                </div>`;
                
                challengesList.appendChild(challengeCard);
            });
        } else {
            challengesList.innerHTML = '<p class="text-gray-500">No active challenges</p>';
        }
        return challengesList.innerHTML;
    }
    
    function renderHistory(data) {
        return `
            <div class="tab-content bg-white shadow rounded-lg p-6">
                <h2 class="text-lg font-semibold mb-4">Challenge Dashboard</h2>
                <div class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="bg-green-100 p-4 rounded-lg">
                            <h3 class="font-semibold text-green-800">Participated</h3>
                            <p class="text-2xl font-bold text-green-900">${data.length || 0}</p>
                        </div>
                        <div class="bg-purple-100 p-4 rounded-lg">
                            <h3 class="font-semibold text-purple-800">Completed</h3>
                            <p  class="text-2xl font-bold text-purple-900">${data.length || 0}</p>
                        </div>
                    </div>

                    <div class="mt-8">
                        <h3 class="text-lg font-semibold mb-4">Active Challenges</h3>
                        <div class="space-y-4">
                            ${challengeListHistory(data)}
                        </div>
                    </div>
                </div>
            </div>`
        ;}
                


    
    function itemSelect(index) {
        console.log(index);
        console.log(cells[index].title);
        window.updateServID(cells[index].title);
        console.log(window.serviceID);
        window.location.href = "cover.html";
    }
    


    async function logout() {
        try {
            const response = await fetch(serverURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: "sign out",
                })
            });
    
            const responseData = await response.json();
            if (response.status === 200) {
                //updateDashboard(responseData.data);
                //return responseData.data;
                return responseData.data;
                //console.log(dashboardData);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
        window.updateUserEmail('');
        window.updateServID('');
        window.location.href = 'index.html';
    }

    async function initPage() {
        // Setup event listeners
        //setupEventListeners();
    
        // Initialize the page
        profile = await fetchUserProfile();
        cells = await fetchChallengesContent();
        history = await fetchHistoryData();
        renderPage();
      }
      
    document.body.appendChild(portalTheme);
    initPage();
});