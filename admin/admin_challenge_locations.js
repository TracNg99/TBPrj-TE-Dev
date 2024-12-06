document.addEventListener("DOMContentLoaded", () => {
    // Check authentication
    if (window.businessEmail === 'default value') {
        window.location.href = 'index.html';
        return;
    }

    const appContainer = document.getElementById('app');
    let locations = [];
    let currentLocation = null;
    let serverURL = "https://us-central1-travel-app-practice-441004.cloudfunctions.net/httpRouting_WebClientVer";

    function renderLocationGrid() {
        const gridHTML = `
        <div class="space-y-6">
            <!-- Header -->
            <div class="flex justify-between items-center">
                <h1 class="text-3xl font-bold text-gray-800">Challenge Locations</h1>
                ${locations.length > 0 ? `
                    <button onclick="window.submitChallenge()" 
                            class="px-6 py-2 bg-success text-white rounded-lg hover:bg-green-700">
                        Submit Challenge
                    </button>
                ` : ''}
                <button onclick="window.navigateTo('admin_portal.html')" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                    Back to Portal
                </button>
                
            </div>

            <!-- Locations Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- New Location Card (Always First) -->
                <div onclick="window.createNewLocation()" 
                     class="cursor-pointer group relative bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border-2 border-dashed border-gray-300 hover:border-primary min-h-[200px] flex flex-col items-center justify-center">
                    <div class="text-6xl text-gray-400 group-hover:text-primary transition-colors duration-200">+</div>
                    <p class="mt-4 text-gray-600 group-hover:text-primary font-medium">Add New Location</p>
                </div>

                ${locations.map((location, index) => `
                    <div onclick="window.editLocation(${index})"
                         class="cursor-pointer group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                        <div class="aspect-w-16 aspect-h-9 rounded-t-lg overflow-hidden">
                            <img src="${location.imageUrls[0] || 'https://via.placeholder.com/400x300'}" 
                                 alt="${location.title}" 
                                 class="w-full h-48 object-cover">
                        </div>
                        <div class="p-6">
                            <h3 class="text-xl font-bold text-gray-800 group-hover:text-primary">${location.title}</h3>
                            <p class="mt-2 text-gray-600">${location.sections ? location.sections.length : 0} sections</p>
                        </div>
                    </div>
                `).join('')}

                

            </div>
        </div>`;

        appContainer.innerHTML = gridHTML;
    }

    function renderLocationEditor(location = null) {
        currentLocation = location || {
            title: '',
            imageUrls: [],
            sections: []
        };

        const editorHTML = `
        <div class="space-y-6">
            <!-- Header -->
            <div class="flex justify-between items-center">
                <h1 class="text-3xl font-bold text-gray-800">${location ? 'Edit' : 'New'} Location</h1>
                ${locations.length > 0 ? `
                    <button onclick="window.submitChallenge()" 
                            class="px-6 py-2 bg-success text-white rounded-lg hover:bg-green-700">
                        Generate QR code for challenge
                    </button>
                ` : ''}
                <button onclick="window.backToGrid()" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                    Back to Locations
                </button>
            </div>

            <!-- Location Editor Form -->
            <div class="bg-white rounded-lg shadow-md p-6 space-y-6">
                <!-- Title Section -->
                <div class="space-y-2">
                    <label class="block font-medium text-gray-700">Location Title</label>
                    <input type="text" id="locationTitle" 
                           value="${currentLocation.title}"
                           onchange="window.updateLocationTitle(this.value)"
                           placeholder="Enter location title"
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                </div>

                <!-- Images Section -->
                <div class="space-y-2">
                    <label class="block font-medium text-gray-700">Location Images</label>
                    <input type="file" id="locationImages" 
                           accept="image/*" multiple
                           class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-blue-600">
                    <div id="imagePreview" class="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                        ${currentLocation.imageUrls.map((img, index) => `
                            <div class="relative group">
                                <img src="${img}" class="w-full h-48 object-cover rounded-lg">
                                <button onclick="window.removeImage(${index})" 
                                        class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Sections -->
                <div class="space-y-4">
                    <div class="flex justify-between items-center">
                        <label class="block font-medium text-gray-700">Content Sections</label>
                        <button onclick="window.addSection()" 
                                class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600">
                            Add Section
                        </button>
                    </div>
                    <div id="sectionsContainer" class="space-y-4">
                        ${currentLocation.sections.map((section, index) => `
                            <div class="border border-gray-200 rounded-lg p-4 space-y-4">
                                <div class="flex justify-between items-center">
                                    <input type="text" 
                                           placeholder="Section Title"
                                           value="${section.title}"
                                           onchange="window.updateSectionTitle(${index}, this.value)"
                                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                                    <button onclick="window.removeSection(${index})"
                                            class="ml-4 text-red-500 hover:text-red-600">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                        </svg>
                                    </button>
                                </div>
                                <textarea placeholder="Section Content"
                                          onchange="window.updateSectionContent(${index}, this.value)"
                                          class="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">${section.content || ''}</textarea>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end space-x-4">
                    <button onclick="window.saveLocation()" 
                            class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600">
                        Save Location
                    </button>
                    
                </div>
            </div>
        </div>`;

        appContainer.innerHTML = editorHTML;
        setupEventListeners();
    }

    function setupEventListeners() {
        const locationImages = document.getElementById('locationImages');
        if (locationImages) {
            locationImages.addEventListener('change', handleImageUpload);
        }
    }

    function handleImageUpload(event) {
        const files = event.target.files;
        if (!files.length) return;

        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                currentLocation.imageUrls.push(e.target.result);
                renderLocationEditor(currentLocation);
            };
            reader.readAsDataURL(file);
        });
    }

    // Global functions
    window.createNewLocation = () => {
        renderLocationEditor();
    };

    window.navigateTo = (page) => {
        window.location.href = page;
    };

    window.editLocation = (index) => {
        renderLocationEditor(locations[index]);
    };

    window.backToGrid = () => {
        renderLocationGrid();
    };

    window.removeImage = (index) => {
        currentLocation.imageUrls.splice(index, 1);
        renderLocationEditor(currentLocation);
    };

    window.addSection = () => {
        currentLocation.sections.push({
            title: '',
            content: ''
        });
        renderLocationEditor(currentLocation);
    };

    window.removeSection = (index) => {
        currentLocation.sections.splice(index, 1);
        renderLocationEditor(currentLocation);
    };

    window.updateLocationTitle = (value) => {
        currentLocation.title = value;
    }

    window.updateSectionTitle = (index, value) => {
        currentLocation.sections[index].title = value;
    };

    window.updateSectionContent = (index, value) => {
        currentLocation.sections[index].content = value;
    };

    window.saveLocation = async () => {
        const title = document.getElementById('locationTitle').value;
        let uploadLocation = null;
        if (!title) {
            alert('Please enter a location title');
            return;
        }

        currentLocation.title = title;
        
        // If editing existing location, update it
        const existingIndex = locations.findIndex(loc => loc.title === currentLocation.title);
        if (existingIndex >= 0) {
            locations[existingIndex] = {...currentLocation};
        } else {
            locations.push({...currentLocation});
        }
        
        uploadLocation = JSON.parse(JSON.stringify(currentLocation));
        //uploadLocation.sections.map((section, index) => {
        //    if (section.content.includes('\n')) {
        //        let lines = section.content.split('\n');
        //        lines = lines.map(line => `<li>${line}</li>`);
        //        uploadLocation.sections[index].content = `<ul class="list-disc list-inside"> ${lines.join('')}</ul>`;
        //    }
        //})
        
        uploadLocation.imageUrls.forEach((img,index) => {
            if (img){
                uploadLocation.imageUrls[index] = img.split(",")[1];
                console.log(uploadLocation.imageUrls[index]);
            }
        });

        try {
            const response = await fetch(serverURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: "update challenge",
                    role: "locations",
                    source: "platform",
                    provider: window.businessName,
                    type: "challenge",
                    serviceID: window.serviceID,
                    locationID: existingIndex == -1 ? `loc${locations.length - 1}` : `loc${existingIndex}`,
                    data: {
                        title: uploadLocation.title,
                        imageUrls: uploadLocation.imageUrls,
                        sections: uploadLocation.sections
                    }
                })
            });

            if (!response.ok) throw new Error('Network response was not ok');
            
            const respData = await response.json();
            if (response.status === 200) {
                alert('Challenge submitted successfully!');
                
            } else {
                throw new Error(respData.message || 'Failed to submit challenge');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to submit challenge. Please try again.');
        }

        renderLocationGrid();
    };

    window.submitChallenge = async () => {
        if (!locations.length) {
            alert('Please add at least one location before submitting');
            return;
        }

        try {
            // Generate QR code with the URL and serviceID
            const baseUrl = window.location.origin + window.location.pathname.replace('admin/admin_challenge_locations.html', 'user/index.html');
            const qrUrl = `${baseUrl}?serviceId=${window.serviceID}`;
            
            // Create QR Code using qrcode-generator
            const qr = qrcode(0, 'L'); // 0: auto-version, L: error correction level
            qr.addData(qrUrl);
            qr.make();

            // Get QR code as base64 image with larger size
            const qrCodeBase64 = qr.createDataURL(20, 4); // cellSize: 20 pixels, margin: 4 cells
            console.log(qrCodeBase64);
            console.log(qrCodeBase64.split(",")[1]);
            try {
                const response = await fetch(serverURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        action: "qrcode challenge",
                        role: "services",
                        source: "platform",
                        provider: window.businessName,
                        type: "challenge",
                        searchField: "serviceID",
                        value: window.serviceID,
                        image: qrCodeBase64.split(",")[1]
                    })
                });
    
                if (!response.ok) throw new Error('Network response was not ok');
                
                const respData = await response.json();
                if (response.status === 200) {
                    alert('QR-code uploaded successfully!\nAvailable in the Challenge tab in your portal!');
                    // Redirect to portal page
                    window.location.href = 'admin_portal.html';
                } else {
                    throw new Error(respData.message || 'Failed to submit challenge');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to upload QRcode. Please try again.');
            }

            
        } catch (error) {
            console.error('Error generating QR code:', error);
            alert('Failed to generate QR code. Please try again.');
        }
    };

    window.closeQRModal = () => {
        document.getElementById('qrModal').classList.add('hidden');
    };

    // Initialize
    async function init() {
        try {
            const response = await fetch(serverURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: "get service",
                    collections: "services",
                    searchField: "serviceID",
                    value: window.serviceID
                })
            });

            if (!response.ok) throw new Error('Network response was not ok');
            
            const repsData = await response.json();
            if (response.status == 200 && repsData.data[0].contents) {
                let slideInfo = []; //responseMessage.data[0].contents
                console.log("Location data:",repsData.data[0].contents);
                for (let jj in repsData.data[0].contents) {
                    item = repsData.data[0].contents;
                    slideInfo.push(item.filter(e => e.locationID == `loc${jj}`)[0]);
                    console.log(slideInfo);
                }

                locations = slideInfo;
                console.log("Received response:", locations);
                console.log(locations.length);
            }
        } catch (error) {
            console.error('Error:', error);
        }

        renderLocationGrid();
    }

    init();
});
