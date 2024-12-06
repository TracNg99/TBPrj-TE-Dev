document.addEventListener('DOMContentLoaded', async function() {
    // Check authentication
    let requestLink = "https://us-central1-travel-app-practice-441004.cloudfunctions.net/httpRouting_WebClientVer";
    let dashboardData = {
        challenges: null,
        participants: []
    };
    
    if (!window.businessEmail) {
        window.location.href = 'index.html';
        return;
    }

    // Set admin email in header
    //document.getElementById('adminEmail').textContent = window.businessEmail;

    function switchTab(tabName) {
        // Hide all content sections
        document.querySelectorAll('.tab-content').forEach(section => {
            section.classList.add('hidden');
        });
    
        // Show selected content section
        document.getElementById(`${tabName}Section`).classList.remove('hidden');
    
        // Fetch challenges when switching to challenges tab
        if (tabName === 'challenges') {
            if (dashboardData.challenges) {
                displayChallenges(dashboardData.challenges);
            }
        }
    
        // Update tab styles
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('border-blue-500', 'text-blue-600');
            btn.classList.add('border-transparent', 'text-gray-500');
        });
    
        const activeTab = document.getElementById(`${tabName}Tab`);
        activeTab.classList.remove('border-transparent', 'text-gray-500');
        activeTab.classList.add('border-blue-500', 'text-blue-600');
    }
    
    async function fetchAdminProfile() {
        try {
            const response = await fetch(requestLink, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: "show profile",
                    collections: "partner",
                    email: window.businessEmail
                })
            });
    
            const responseData = await response.json();
            if (response.status === 200) {
                console.log("Received response:", responseData.message);
                window.updateBusinessName(responseData.data.name)
                populateProfileData(responseData.data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    }
    
    function populateProfileData(data) {
        document.getElementById('adminName').value =data.name || '';
        document.getElementById('profileBusinessName').value = data.name || '';
        document.getElementById('profileEmail').value = window.businessEmail;
        document.getElementById('businessDescription').value = data.description || '';
        document.getElementById('businessLocation').value = data.location || '';
        document.getElementById('businessPhone').value = data.phone || '';
    }
    
    function setupFormListeners() {
        // Profile form
        document.getElementById('profileForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = {
                businessName: document.getElementById('profileBusinessName').value
            };
            await updateProfile(formData);
        });
    
        // Business form
        document.getElementById('businessForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = {
                description: document.getElementById('businessDescription').value,
                location: document.getElementById('businessLocation').value,
                phone: document.getElementById('businessPhone').value
            };
            await updateBusinessInfo(formData);
        });

        // Logout functionality
        document.getElementById('logoutBtn').addEventListener('click', function() {
            window.updateServID(null);
            window.updateBusinessEmail(null);
            window.updateBusinessName(null);
            localStorage.removeItem('serviceID');
            localStorage.removeItem('businessEmail');
            localStorage.removeItem('businessName');
            window.location.href = 'index.html';
        });
    }
    
    async function updateProfile(formData) {

        try {
            const response = await fetch(requestLink, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: "update profile",
                    collections: "partner",
                    email: window.businessEmail,
                    name: formData.businessName,
                    username: formData.businessName
                })
            });
    
            if (response.status === 200) {
                alert('Profile updated successfully');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        }
    }
    
    async function updateBusinessInfo(formData) {
        let businessInfo = {
            action: "update profile",
            collections: "partner",
            email: window.businessEmail,
            description: formData.description,
            location: formData.location,
            phone: formData.phone
        };
        try {
            const response = await fetch(requestLink, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(businessInfo)
            });

            const responseData = await response.json();
    
            if (response.status === 200) {
                window.updateBusinessName(responseData.data.name)
                alert('Business information updated successfully');
            }
        } catch (error) {
            console.error('Error updating business info:', error);
            alert('Failed to update business information');
        }
    }

    
    async function fetchDashboardData(servName) {
        try {
            const response = await fetch(requestLink, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: "get service",
                    collections: "booking",
                    searchField: "serviceID",
                    value: servName
                })
            });
    
            const responseData = await response.json();
            if (response.status === 200) {
                //updateDashboard(responseData.data);
                return responseData.data;
                //console.log(dashboardData);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    }
    
    function updateDashboard(data) {
        // Update statistics
        document.getElementById('totalChallenges').textContent = data.challenges.length || 0;
        document.getElementById('activeParticipants').textContent = data.participants.length || 0;
        document.getElementById('completedChallenges').textContent = data.participants.filter(item => ('images' in item || 'contents' in item)).length || 0;
        // Update active challenges list
        const challengesList = document.getElementById('activeChallengesList');
        challengesList.innerHTML = '';
    
        if (data.challenges && data.challenges.length > 0) {
            data.challenges.forEach(challenge => {
                const challengeCard = document.createElement('div');
                const matchedUsers = data.participants.filter(item => item.serviceID == challenge.serviceID);
                challengeCard.className = 'bg-white p-4 rounded-lg shadow';
                challengeCard.innerHTML = `
                    <h4 class="font-bold text-lg">${challenge.serviceID}</h4>
                    <p class="text-gray-600 text-sm">
                        Participants:
                        ${matchedUsers.length}
                    </p>`
                challengeCard.innerHTML += `
                    ${matchedUsers.map((user,uidx) => `
                        <h4 class="pt-6 font-semibold text-lg">User #${uidx+1}: ${user.useremail}</h4>
                        ${user.images.map((image, index) => `
                        <h4 class="font-semibold text-lg">${user.text[index].title}</h4>
                        <p class="text-gray-600 text-sm">
                            Comments:
                            ${user.text[index].text}
                        </p>
                        <img src="${image}" alt="User Image" class="w-12 h-12 rounded-full mr-2">
                        `).join('')}
                        `)}`;
                challengesList.appendChild(challengeCard);
            });
        } else {
            challengesList.innerHTML = '<p class="text-gray-500">No active challenges</p>';
        }
    }
    
    //Fecth exsiting challenges created by current busienss account
    async function fetchChallenges() {
        try {
            const response = await fetch(requestLink, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: "get service",
                    collections: "services",
                    searchField: "provider",
                    value: window.businessName
                })
            });
    
            const resposenData = await response.json();
            if (response.status === 200) {
                console.log("Received response:", response.status, resposenData.message);
                console.log("Received response data:", resposenData);
                console.log("Received response data:", resposenData.data[0].provider);
            }
            dashboardData['challenges'] = resposenData.data;
            console.log(dashboardData);
            //displayChallenges(resposenData.data || []);
        } catch (error) {
            console.error('Error fetching challenges:', error);
        }
    }
    
    //Display the grid of challenge cards
    function displayChallenges(challenges) {
        const challengesGrid = document.getElementById('challengesGrid');
        challengesGrid.innerHTML = ''; // Clear existing content
    
        // Add existing challenge cards
        challenges.forEach(challenge => {
            const card = createChallengeCard(challenge);
            challengesGrid.appendChild(card);
        });
    
        // Add "Create new challenge" card
        const newChallengeCard = createNewChallengeCard();
        challengesGrid.appendChild(newChallengeCard);
    }
    
    function createChallengeCard(challenge) {
        const card = document.createElement('div');
        card.className = 'bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow';
        card.innerHTML = `
            <img src="${challenge.logourl}" alt="${challenge.serviceID}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="text-lg font-semibold mb-2">${challenge.serviceID}</h3>
                <div class="flex justify-between items-center mt-4">
                    <button class="edit-btn px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Edit Challenge</button>
                    <button class="qr-btn px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">View QR Code</button>
                </div>
            </div>
        `;
        
        // Edit button click handler
        card.querySelector('.edit-btn').addEventListener('click', () => {
            window.updateServID(challenge.serviceID);
            window.location.href = 'admin_challenge_locations.html';
        });

        // QR code button click handler
        card.querySelector('.qr-btn').addEventListener('click', () => {
            generateAndShowQRCode(challenge.serviceID);
        });
        
        return card;
    }

    function generateAndShowQRCode(serviceID) {
        // Generate QR code with the URL and serviceID
        const baseUrl = window.location.origin + window.location.pathname.replace('admin/admin_portal.html', 'index.html');
        const qrUrl = `${baseUrl}?serviceId=${serviceID}`;
        
        // Clear previous QR code if any
        document.getElementById('qrcode').innerHTML = '';
        
        // Generate new QR code
        QRCode.toCanvas(document.getElementById('qrcode'), qrUrl, {
            width: 200,
            margin: 2
        });

        // Show the modal
        document.getElementById('qrModal').classList.remove('hidden');
    }

    window.closeQRModal = () => {
        document.getElementById('qrModal').classList.add('hidden');
    };

    function createNewChallengeCard() {
        const card = document.createElement('div');
        card.className = 'bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer flex flex-col items-center justify-center min-h-[200px]';
        card.innerHTML = `
            <div class="text-4xl text-blue-500 mb-2">+</div>
            <p class="text-gray-600">Create new challenge</p>
        `;
        
        card.addEventListener('click', () => {
            window.location.href = 'admin_challenge_cover.html';
        });
        
        return card;
    }

    // Initialize tabs
    const tabs = ['profile', 'business', 'challenges', 'dashboard'];
    tabs.forEach(tab => {
        document.getElementById(`${tab}Tab`).addEventListener('click', () => switchTab(tab));
    });

    // Show profile tab by default
    switchTab('profile');
    await fetchAdminProfile();


    // Form submissions
    setupFormListeners();
    await fetchChallenges();
    
    for (let i = 0; i < dashboardData.challenges.length; i++) {
        bookedData = await fetchDashboardData(dashboardData.challenges[i].serviceID);
        //console.log(bookedData);
        dashboardData['participants'].push(bookedData[0]);
    }
    //console.log(dashboardData);
    updateDashboard(dashboardData);
    
});
