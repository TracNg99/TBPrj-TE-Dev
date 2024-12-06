document.addEventListener('DOMContentLoaded', async function() {
    // Check authentication
    if (window.businessEmail === 'default value') {
        window.location.href = 'index.html';
        return;
    }
    
    let requestLink = "https://us-central1-travel-app-practice-441004.cloudfunctions.net/httpRouting_WebClientVer";
    let dashboardData = {
        challenges: null,
        participants: []
    };
    

    

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
        document.getElementById('logoutBtn').addEventListener('click', async function() {
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
                        window.updateServID('default value');
                        window.updateBusinessEmail('default value');
                        window.updateBusinessName('default value');
                        localStorage.removeItem('serviceID');
                        localStorage.removeItem('businessEmail');
                        localStorage.removeItem('businessName');
                        window.location.href = 'index.html';
                        return responseData.message;
                        //console.log(dashboardData);
                    }
                } catch (error) {
                    console.error('Error fetching dashboard data:', error);
            }
            
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
                    </p>
                    <img src="${challenge.qrUrl || ''}" alt="User Image" class="w-12 h-12 rounded-full mr-2">
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
                        <div class="mt-4 border-t pt-4">
                            <h4 class="font-semibold text-lg">Upload Video Response</h4>
                            <div class="flex items-center space-x-4 mt-2">
                            <input type="file" 
                                    id="video-upload-${challenge.serviceID}" 
                                    class="hidden" 
                                    accept="video/*"
                                    onchange="handleVideoUpload(event, '${challenge.serviceID}')">
                            <label for="video-upload-${challenge.serviceID}" 
                                    class="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600">
                                Choose Video
                            </label>
                            <span id="video-name-${challenge.serviceID}" class="text-gray-600"></span>
                            </div>
                            <div id="video-preview-${challenge.serviceID}" class="mt-2">
                                    <!-- Video preview will appear here -->
                            </div>
                            <!--
                            <button id="uploadVideo-UserNo${uidx}"
                                class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600">
                                    Confirm
                            </button>
                            -->
                        </div> 
                        `)}
                    
                        `;
                
                challengesList.appendChild(challengeCard);
            });
        } else {
            challengesList.innerHTML = '<p class="text-gray-500">No active challenges</p>';
        }
    }

    window.handleVideoUpload = async (event, serviceID) => {
        const file = event.target.files[0];
        if (!file) return;
    
        // Update file name display
        document.getElementById(`video-name-${serviceID}`).textContent = file.name;
    
        // Create video preview
        const previewContainer = document.getElementById(`video-preview-${serviceID}`);
        previewContainer.innerHTML = `
            <video controls class="mt-2 max-w-full h-auto">
                <source src="${URL.createObjectURL(file)}" type="${file.type}">
                Your browser does not support the video tag.
            </video>
        `;
        
        //document.getElementById(`uploadVideo-UserNo${event.target.id.split('UserNo')[1]}`).addEventListener('click', () => {
        //    uploadVideoToServer(file, serviceID);
        //});

        try {
            // Convert video to base64
            const reader = new FileReader();
            reader.onload = async function(e) {
                const base64Video = e.target.result;
                //console.log(base64Video);
                
                // Send to server
                const response = await fetch(requestLink, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        action: "upload output",
                        role: "booking",
                        source: "platform",
                        provider: window.businessName,
                        type: "challenge",
                        searchField: ["serviceID", "useremail"],
                        value: [window.serviceID, window.signInEmail],
                        data: base64Video
                    })
                });
    
                if (!response.ok) throw new Error('Network response was not ok');
                
                const respData = await response.json();
                if (response.status === 200) {
                    alert('Video uploaded successfully!');
                } else {
                    throw new Error(respData.message || 'Failed to upload video');
                }
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to upload video. Please try again.');
        }
    };

    
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
                    <button class="qr-btn px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" data-qr-url="${challenge.qrUrl || ''}">View QR Code</button>
                </div>
            </div>
        `;
        
        // Edit button click handler
        card.querySelector('.edit-btn').addEventListener('click', () => {
            window.updateServID(challenge.serviceID);
            window.location.href = 'admin_challenge_locations.html';
        });

        // QR code button click handler
        
        card.querySelector('.qr-btn').addEventListener('click', (e) => {
            const qrUrl = e.target.getAttribute('data-qr-url');
            if (qrUrl) {
                showQRCode(qrUrl);
            } else {
                alert('QR code not available for this challenge');
            }
        });
        
        return card;
    }

    function showQRCode(qrData) {
        const qrImage = document.getElementById('qrImage');
        
        // Clear any existing QR code
        document.getElementById('qrcode').innerHTML = `
            <img src="${qrData}" id="qrImage" class="mx-auto sm:w-1/2" alt="QR Code">
        `;
        document.getElementById('challengeID').textContent = dashboardData.challenges[0].serviceID;

        // Show the modal
        document.getElementById('qrModal').classList.remove('hidden');
    }

    window.closeQRModal = () => {
        document.getElementById('qrModal').classList.add('hidden');
    };
    
    window.downloadQRCode = () => {
        const qrImage = document.getElementById('qrImage');
        
        // Create a temporary link element
        const downloadLink = document.createElement('a');
        downloadLink.href = qrImage.src;
        downloadLink.download = `qrcode_${window.serviceID}.png`;
        
        // Trigger download
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
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
