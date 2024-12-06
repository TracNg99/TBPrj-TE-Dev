document.addEventListener("DOMContentLoaded", () => {
    // Check authentication
    if (window.signInEmail === 'default value') {
        window.location.href = 'index.html';
        return;
    }

    console.log("ServiceID:", window.serviceID);
    const slideshowContainer = document.getElementById('slideshow-container');

    // State management
    let slides = [];
    let currentSlideIndex = 0;
    let sectionsStatus = ["block", "none", "none", "none"];
    let bgImg = "";


    // Store user inputs as an object with slide IDs as keys
    let userInputs = [];

    // API configuration
    let uploadInfoText = {
        action: "get service", 
        collections: "services",
        searchField: "serviceID", 
        value: `${window.serviceID}`
    };
    let serverURL = "https://us-central1-travel-app-practice-441004.cloudfunctions.net/httpRouting_WebClientVer";

    function createSlideHTML(slideData) {
        if (!slideData) return '';
        const slideId = slideData.title.replace(/\s+/g, "");
        // Find existing input for this slide
        const existingInput = userInputs.find(input => input.title === slideData.title);
        const userInput = existingInput ? existingInput.text : '';
        //console.log(slideData.title.replace(/\s+/g, ""));
        return `
            <div class="relative w-full min-h-screen rounded-lg shadow-lg p-6 bg-gray-600">
  
                <h2 class="text-2xl font-bold text-primary mb-4">${slideData.title || ''}</h2>
                ${slideData.imageUrls.map((img,index) => `
                  <img src="${img}" 
                       alt="${slideData.title}" 
                       class="w-full h-128 object-cover rounded-lg mt-4">
                `).join('') || ''}
              <div class="prose max-w-none text-white" data-accordion="open">
              ${slideData.sections.map((section,index) =>`
                <div class="mb-4">
                  <h2 id="accordion-collapse-heading-${index}">
                    <button type="button" 
                            class="flex items-center justify-between w-full p-5 font-medium text-blue border border-gray-200 rounded-t-xl hover:bg-gray-100 transition-all duration-200" 
                            data-accordion-target="#accordion-collapse-body-${index}" 
                            aria-expanded="false" 
                            aria-controls="accordion-collapse-body-${index}">
                      <span class="text-2xl font-bold text-primary">${section.title}</span>
                      <svg data-accordion-icon class="w-3 h-3 transition-transform duration-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1l4 4 4-4"/>
                      </svg>
                    </button>
                  </h2>
                  <div id="accordion-collapse-body-${index}" 
                       class="hidden overflow-hidden transition-[max-height] duration-300 ease-in-out" 
                       aria-labelledby="accordion-collapse-heading-${index}">
                    <div class="p-5 border border-t-0 border-gray-200">
                      <p class="text-white text-large">${section.content || ''}</p>
                    </div>
                  </div>
                </div>
                `
              )}
                <div class="mb-4">
                  <h2 id="accordion-collapse-heading-${slideData.sections.length}">
                    <button type="button" 
                            class="flex items-center justify-between w-full p-5 font-medium text-gray-500 border border-gray-200 rounded-t-xl hover:bg-gray-100 transition-all duration-200" 
                            data-accordion-target="#accordion-collapse-body-${slideData.sections.length}" 
                            aria-expanded="false" 
                            aria-controls="accordion-collapse-body-${slideData.sections.length}">
                      <span class="text-2xl font-bold text-primary">Share your experience</span>
                      <svg data-accordion-icon class="w-3 h-3 transition-transform duration-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1l4 4 4-4"/>
                      </svg>
                    </button>
                  </h2>
                  <div id="accordion-collapse-body-${slideData.sections.length}" 
                       class="hidden overflow-hidden transition-[max-height] duration-300 ease-in-out" 
                       aria-labelledby="accordion-collapse-heading-${slideData.sections.length}">
                    <div class="p-5 border border-t-0 border-gray-200">
                        <label for="textInput${slideData.title.replace(/\s+/g, "")}" class="block font-bold mb-2">Your Story</label>
                        <div class="relative">
                            <input id="textInput${slideData.title.replace(/\s+/g, "")}" 
                                   type="description"
                                   placeholder="Your Story... leave your notes and we will write it for you!"
                                   value="${userInput}"
                                   class="h-32 w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                            
                            ${userInput ? `
                            <div class="mt-2 text-sm text-white-600">
                                <em>Previous input saved. Edit above to update your story.</em>
                            </div>
                            ` : ''}
                        
                            <button id="${slideData.title.replace(/\s+/g, "")}" class="mt-4 px-6 py-2 bg-primary text-white rounded-lg 
                                                          hover:bg-blue-600 transition-colors duration-200">
                                    ${userInput ? 'Update' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        `;
    }

    function createNavSlide(slideData, numCol) {
        if (!slideData || !slideData.length) return '';
        return slideData.map((item, index) => `
            <div id="goToSlide${index}"  
                 class="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer 
                        transform transition-transform duration-200 hover:scale-105">
                ${item.imageUrls[0] ? `
                    <img src="${item.imageUrls[0]}" 
                         alt="${item.title}" 
                         class="w-full h-48 object-cover">
                ` : ''}
                <div class="p-4">
                    <h3 class="text-lg font-semibold text-primary">${item.title || ''}</h3>
                </div>
            </div>
        `).join('');
    }

    function sideBarContentDisplay(slideData) {
        if (!slideData || !slideData.length) return '';
        return slideData.map((item, index) => `
            <button id="sidebarGoToSlide${index}" 
                    class="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200">
                ${item.title || `Slide ${index + 1}`}
            </button>
        `).join('');
    }

    function renderSlides(statusSect) {
        if (!slideshowContainer) return;
        //bg-[url('./background.jpg')]
        slideshowContainer.innerHTML = `
            <div class="relative min-h-screen bg-gray-100 bg-[url('background.jpg')]">
                <!-- Main Content -->                
                <div class="ml-0 lg:ml-64 min-h-screen pt-12"> <!-- Add top padding to account for fixed header -->
                <div class="fixed top-0 left-0 right-0 h-12 bg-white shadow-md z-50 flex items-center px-4">
                <!-- Inter-page Navbar Toggle -->
                <button id="navbarToggle" class="p-2 hover:bg-gray-100 rounded-lg">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                </button>
            </div>

                <div id="navbar" class="fixed top-12 left-0 h-[calc(100vh-3rem)] w-64 bg-white shadow-lg transform -translate-x-full transition-transform duration-200 z-40">

                <div class="p-4 border-b">
                    <a href=index.html" class="flex items-center space-x-2 text-primary hover:text-blue-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                        </svg>
                        <span class="font-semibold">Home</span>
                    </a>
                </div>

                <nav class="p-4 space-y-2">
                    <a href="userportal.html" class="flex items-center space-x-2 text-primary hover:text-blue-600">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span>Profile</span>
                    </a>
                    <button id="logoutBtn" class="w-full text-left p-2 rounded-lg hover:bg-gray-100 flex items-center space-x-2 text-red-600">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                        </svg>
                       <span>Logout</span>
                    </button>
                </nav>
            </div>


                    <!-- Sidebar Toggle -->
                        <div class="text-center">
                            <button id="sidebarToggle" 
                                class="fixed bottom-4 left-4 bg-primary text-white px-4 py-2 rounded-lg shadow-lg 
                                hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 cursor-move z-50"
                                draggable="true">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5l-2 2 2 2 2-2-2-2z"/>
                            </svg>
                            </button>
                    </div>
                    <!-- Sidebar -->
                    <div id="sidebar" class="fixed inset-0 flex items-center justify-center z-50 transform scale-0 opacity-0 
                         transition-all duration-300 ease-in-out">
                        <div class="bg-white rounded-xl shadow-2xl w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto p-6 relative">
                            <!-- Close Button -->
                            <button id="closeOverlay" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                            
                            <h2 class="text-2xl font-bold text-primary mb-6">Choose Your Section</h2>
                            
                            <!-- Grid Layout -->
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                ${slides.map((slide, index) => `
                                    <button id="sidebarGoToSlide${index}"
                                            class="group bg-white p-4 rounded-lg shadow-md hover:shadow-lg 
                                                   transition-all duration-200 flex flex-col items-center space-y-4
                                                   ${currentSlideIndex === index ? 'ring-2 ring-primary' : ''}">
                                        <div class="w-12 h-12 flex items-center justify-center rounded-full 
                                                    ${currentSlideIndex === index ? 'bg-primary text-white' : 'bg-gray-100 group-hover:bg-primary group-hover:text-white'}
                                                    transition-colors duration-200">
                                            ${index + 1}
                                        </div>
                                        <h3 class="text-lg font-semibold text-gray-800">${slide.title}</h3>
                                        ${userInputs[index] ? 
                                            `<div class="text-green-500">
                                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                                                </svg>
                                            </div>` : ''}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Overlay -->
                    <div id="sidebarOverlay" 
                         class="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 opacity-0 pointer-events-none z-40">
                    </div>
                    <!-- Navigation Section -->
                    <div id="navSection" class="relative p-6 ${statusSect[0] === 'block' ? '' : 'hidden'}">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            ${createNavSlide(slides, 2)}
                        </div>
                    </div>

                    <!-- Content Section -->
                    <div id="contentSection" class="relative p-6 ${statusSect[1] === 'block' ? '' : 'hidden'}">
                        ${slides[currentSlideIndex] ? createSlideHTML(slides[currentSlideIndex]) : ''}
                        
                        <button id="prevBtn" 
                                class="absolute left-4 top-1/2 transform -translate-y-1/2 
                                       bg-primary text-white p-2 rounded-full shadow-lg
                                       hover:bg-blue-600 transition-colors duration-200">
                            &#10094;
                        </button>
                        
                        <button id="nextBtn" 
                                class="absolute right-4 top-1/2 transform -translate-y-1/2 
                                       bg-primary text-white p-2 rounded-full shadow-lg
                                       hover:bg-blue-600 transition-colors duration-200">
                            &#10095;
                        </button>
                    </div>

                    <!-- Review Section -->
                    <div id="reviewSection" class="p-6 ${statusSect[2] === 'block' ? '' : 'hidden'}">
                        <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
                            <!-- Photo Upload Section -->
                            <h2 class="text-2xl font-bold text-primary mb-4">Upload your photos!</h2>
                            <input type="file" 
                                   id="uploadImage" 
                                   accept="image/*" 
                                   multiple 
                                   class="block w-full text-sm text-gray-500
                                          file:mr-4 file:py-2 file:px-4
                                          file:rounded-full file:border-0
                                          file:text-sm file:font-semibold
                                          file:bg-primary file:text-white
                                          hover:file:bg-blue-600" />
                            <div id="preview" class="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4"></div>

                            <!-- Notes Review Section -->
                            <div class="mb-8">
                                <h2 class="text-2xl font-bold text-primary mb-4">Review your notes</h2>
                                ${userInputs.length > 0 ? `
                                    <div class="space-y-4 mb-8">
                                    ${userInputs.map((input, index) => `
                                        <div class="bg-gray-100 p-4 rounded-lg">
                                            <h3 class="text-lg font-semibold text-primary">${input.title}</h3>
                                            <p class="text-gray-600">${input.text}</p>
                                        </div>
                                    `).join('')}
                                    </div>
                                `:`
                                    <p class="text-gray-500 italic mb-8">No stories shared yet. Go back to previous sections to share your experiences!</p>
                                
                                `}
                            </div>

                            <button id="submitBtn" 
                                    class="mt-4 px-6 py-2 bg-primary text-white rounded-lg 
                                           hover:bg-blue-600 transition-colors duration-200">
                                Submit
                            </button>
                            
                        </div>
                    </div>

                    <!-- End Section -->
                    <div id="endSection" class="p-6 ${statusSect[3] === 'block' ? '' : 'hidden'}">
                        <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 text-center">
                            <h2 class="text-2xl font-bold text-primary mb-4">Congratulations!</h2>
                            <p class="text-gray-600">You've completed the challenge. See you on the next one!</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        setupEventListeners();
    }

    function setupEventListeners() {
        // Toggle navbar visibility
        document.getElementById('navbarToggle').addEventListener('click', function() {
            const navbar = document.getElementById('navbar');
            navbar.classList.toggle('-translate-x-full');
        });

        // Close navbar when clicking outside
        document.addEventListener('click', function(event) {
            const navbar = document.getElementById('navbar');
            const navbarToggle = document.getElementById('navbarToggle');
            
            if (!navbar.contains(event.target) && !navbarToggle.contains(event.target) && !navbar.classList.contains('-translate-x-full')) {
                navbar.classList.add('-translate-x-full');
            }
        });

        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        const closeOverlay = document.getElementById('closeOverlay');

        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('scale-0');
            sidebar.classList.toggle('opacity-0');
            sidebarOverlay.classList.toggle('opacity-0');
            sidebarOverlay.classList.toggle('pointer-events-none');
        });

        closeOverlay.addEventListener('click', () => {
            sidebar.classList.add('scale-0');
            sidebar.classList.add('opacity-0');
            sidebarOverlay.classList.add('opacity-0');
            sidebarOverlay.classList.add('pointer-events-none');
        });

        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.add('scale-0');
            sidebar.classList.add('opacity-0');
            sidebarOverlay.classList.add('opacity-0');
            sidebarOverlay.classList.add('pointer-events-none');
        });

        const goToNav = document.getElementById('goToNav');
        const toReviewSect = document.getElementById('toReviewSect');
        const toEndSect = document.getElementById('toEndSect');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const uploadImage = document.getElementById('uploadImage');
        const submitBtn = document.getElementById('submitBtn');

        if (goToNav) goToNav.onclick = () => sect_open(0);
        if (toReviewSect) toReviewSect.onclick = () => sect_open(2);
        if (toEndSect) toEndSect.onclick = () => sect_open(3);
        if (prevBtn) prevBtn.onclick = () => navigateSlides('prev');
        if (nextBtn) nextBtn.onclick = () => navigateSlides('next');
        if (uploadImage) uploadImage.onchange = setupImagePreview;
        if (submitBtn) submitBtn.onclick = uploadPhotosContent;

        slides.map((_,jj) => {
            document.getElementById(`sidebarGoToSlide${jj}`).onclick = () => chooseSlides(jj,1);
            document.getElementById(`goToSlide${jj}`).onclick = () => chooseSlides(jj,1);
            let slideBtnId = slides[jj].title;
            let slideInputButton = document.getElementById(slideBtnId.replace(/\s+/g, ""));
            if (slideInputButton) slideInputButton.onclick = () => getInfoText(slideBtnId);
        });

        // Setup accordion functionality
        document.querySelectorAll('[data-accordion-target]').forEach(button => {
            button.addEventListener('click', () => {
                const target = document.querySelector(button.getAttribute('data-accordion-target'));
                const icon = button.querySelector('[data-accordion-icon]');
                
                // Toggle the content visibility
                if (target.classList.contains('hidden')) {
                    target.classList.remove('hidden');
                    target.style.maxHeight = target.scrollHeight + "px";
                    icon.style.transform = 'rotate(180deg)';
                    button.setAttribute('aria-expanded', 'true');
                } else {
                    target.style.maxHeight = "0px";
                    setTimeout(() => {
                        target.classList.add('hidden');
                    }, 300); // Match the transition duration
                    icon.style.transform = 'rotate(0deg)';
                    button.setAttribute('aria-expanded', 'false');
                }
            });
        });

        // Add drag functionality to sidebar toggle
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        sidebarToggle.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);
        document.getElementById('logoutBtn').onclick = () => logout();

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            if (e.target === sidebarToggle) {
                isDragging = true;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                setTranslate(currentX, currentY, sidebarToggle);
            }
        }

        function dragEnd() {
            isDragging = false;
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
        }
    }

    function getInfoText(slideTitle) {
        const slideId = slideTitle.replace(/\s+/g, "");
        const slideInput = document.getElementById(`textInput${slideId}`).value;
        
        if (slideInput.trim()) {
            // Check if we already have an input for this slide
            const existingIndex = userInputs.findIndex(input => input.title === slideTitle);
            
            if (existingIndex !== -1) {
                // Update existing input
                userInputs[existingIndex].text = slideInput;
            } else {
                // Add new input
                userInputs.push({
                    title: slideTitle,
                    text: slideInput
                });
            }
            
            // Update button text
            const button = document.getElementById(slideId);
            button.textContent = 'Update';
            
            // Add or update the "saved" message
            let savedMsg = document.querySelector(`#textInput${slideId} + div.text-sm`);
            if (!savedMsg) {
                savedMsg = document.createElement('div');
                savedMsg.className = 'mt-2 text-sm text-gray-600';
                document.getElementById(`textInput${slideId}`).parentNode.insertBefore(
                    savedMsg,
                    document.getElementById(slideId)
                );
            }
            savedMsg.innerHTML = '<em class="text-white">Previous input saved. Edit above to update your notes.</em>';
        }
    }

    function navigateSlides(direction) {
        if (direction === 'prev' && currentSlideIndex > 0) {
            currentSlideIndex--;
        } else if (direction === 'prev' && currentSlideIndex == 0) {
            sect_open(0);  
        } else if (direction === 'next' && currentSlideIndex < slides.length - 1) {
            currentSlideIndex++;
        } else if (direction === 'next' && currentSlideIndex == slides.length - 1) {
            sect_open(2);  
        } 
        renderSlides(sectionsStatus);
    }

    function chooseSlides(chosenIdx,targetSection) {
        currentSlideIndex = chosenIdx;
        sect_open(targetSection);
    }

    function sect_open(idx) {
        sectionsStatus = sectionsStatus.map((_, index) => index === idx ? 'block' : 'none');
        renderSlides(sectionsStatus);
    }

    function navigateTo(page) {
        window.location.href = page;
    }

    async function fetchSlideContent() {
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

            const responseMessage = await response.json();
            console.log("HTTPS response status code:", response.status);
            console.log("HTTPS response message:", responseMessage.message);
            console.log("HTTPS response content:", responseMessage.data[0].serviceID);
            console.log("HTTPS response inner:", responseMessage.data[0].contents[0].title);
            console.log(responseMessage.data[0].provider);
            window.updateProvider(responseMessage.data[0].provider);
            
            let slideInfo = []; //responseMessage.data[0].contents
            console.log("Location data:",responseMessage.data[0].contents);
            for (let jj in responseMessage.data[0].contents) {
                item = responseMessage.data[0].contents;
                slideInfo.push(item.filter(e => e.locationID == `loc${jj}`)[0]);
                console.log(slideInfo);
            }

            return slideInfo;
        } catch (error) {
            console.error("Error fetching slides:", error);
            return [];
        }
    }

    function setupImagePreview() {
        const preview = document.getElementById('preview');
        const uploadImage = document.getElementById('uploadImage');
        
        if (!preview || !uploadImage) return;
        
        // Clear existing preview
        preview.innerHTML = '';
        
        // Create preview for each selected file
        Array.from(uploadImage.files).forEach((file, index) => {
            if (!file.type.startsWith('image/')) return;
            
            const reader = new FileReader();
            const imageContainer = document.createElement('div');
            imageContainer.className = 'relative group';
            
            reader.onload = (e) => {
                imageContainer.innerHTML = `
                    <img src="${e.target.result}" 
                         alt="Preview ${index + 1}" 
                         class="w-full h-48 object-cover rounded-lg">
                    <button type="button"
                            data-index="${index}"
                            class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1
                                   opacity-0 group-hover:opacity-100 transition-opacity duration-200
                                   hover:bg-red-600">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                `;
                
                // Add remove button functionality
                const removeBtn = imageContainer.querySelector('button');
                removeBtn.onclick = () => {
                    imageContainer.remove();
                };
            };
            
            reader.readAsDataURL(file);
            preview.appendChild(imageContainer);
        });
    }

    

    async function uploadPhotosContent() {
        // Get all uploaded images
        const preview = document.getElementById('preview');
        const images = Array.from(preview.querySelectorAll('img'))
            .map(img => (img.src.split(",")[1]));

        // Create upload payload
        const uploadData = {
            action: "challenge input",
            role: "booking",
            provider: window.provider,
            serviceID: window.serviceID,
            useremail: window.signInEmail,
            type: "challenge",
            notes: Object.values(userInputs), // Convert object values to array
            images: images
        };

        try {
            const response = await fetch(serverURL, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(uploadData)
            });

            if (!response.ok) {
                throw new Error('Failed to upload content');
            }

            const result = await response.json();
            console.log('Upload successful:', result);

            // Show success message
            const submitBtn = document.getElementById('submitBtn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Uploaded Successfully!';
            submitBtn.classList.add('bg-success');
            
            // Reset form after successful upload
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.classList.remove('bg-success');
                document.getElementById('preview').innerHTML = '';
                document.getElementById('uploadImage').value = '';
                document.querySelectorAll('.section-content textarea')
                    .forEach(textarea => textarea.value = '');
            }, 2000);

            // Move to end section
            sect_open(3);

        } catch (error) {
            console.error('Upload error:', error);
            
            // Show error message
            const submitBtn = document.getElementById('submitBtn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Upload Failed! Try Again';
            submitBtn.classList.add('bg-danger');
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.classList.remove('bg-danger');
            }, 2000);
        }
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
            let respData = await response.json();
            console.log(respData.message);
            if (response.status === 200) {
                window.updateUserEmail('default value');
                window.updateServID('default value');
                window.location.href = 'index.html';
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
        
    }
    // Initialize
    async function initSlideshow() {
        slides = await fetchSlideContent();
        if (slides && slides.length > 0) {
            console.log("Slides loaded:", slides.length);
            renderSlides(sectionsStatus);
        } else {
            console.error("No slides loaded");
        }
    }

    // Start the application
    initSlideshow();
});
