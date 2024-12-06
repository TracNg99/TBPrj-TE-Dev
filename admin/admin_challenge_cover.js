document.addEventListener("DOMContentLoaded", () => {
  // Check authentication
  if (window.businessEmail === 'default value') {
    window.location.href = 'index.html';
    return;
  }
  const appContainer = document.getElementById('app');
  let userInputs = {
    title: "",
    text: "",
    titleStatus: "hidden",
    textStatus: "hidden"
  };
  let serverURL = "https://us-central1-travel-app-practice-441004.cloudfunctions.net/httpRouting_WebClientVer";
  let userImg = [];

  function renderPage() {
    const existingInput = userInputs;
    const userInput = existingInput ? existingInput : '';
    appContainer.innerHTML = `
    <div class="relative w-full min-h-screen text-white" style="background-color: rgb(31, 41, 55);">
      <!-- Inter-page Navbar Toggle -->
      <div class="p-4">
        <button id="navbarToggle" class="p-2 hover:bg-gray-100 hover:text-gray-800 rounded-lg">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>

      <!-- Sidebar Navigation -->
      <div id="navbar" class="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg transform -translate-x-full transition-transform duration-200 z-50">
        <div class="p-4 border-b">
          <a href="index.html" class="flex items-center space-x-2 text-primary hover:text-blue-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span class="font-semibold">Home</span>
          </a>
        </div>

        <nav class="p-4 space-y-2">
          <a href="admin_portal.html" class="flex items-center space-x-2 text-primary hover:text-blue-600">
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

      <!-- Main Content -->
      <div class="container mx-auto px-4 py-8">
        <div class="max-w-2xl mx-auto space-y-8">
          <!-- Title Section -->
          <div class="space-y-4">
            <div class="flex flex-col space-y-4 ${userInput.titleStatus === 'block' ? 'hidden' : ''}">
              <label for="titleInput" class="block font-bold mb-2">Your Challenge Title</label>
              <input id="titleInput" type="text"
                placeholder="What would you like to call your challenge?"
                value="${userInput.title}"
                class="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <button id="confirmTitle" class="w-full mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">
                Confirm
              </button>
            </div>
            
            <div class="${userInput.titleStatus === 'block' ? '' : 'hidden'} space-y-4">
              <h1 class="text-4xl font-bold text-white text-center bg-black bg-opacity-30 p-4 rounded-lg">
                ${userInput.title}
              </h1>
              <button id="editTitle" class="w-full mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">
                Edit Title
              </button>
            </div>
          </div>

          <!-- Description Section -->
          <div class="space-y-4">
            <div class="flex flex-col space-y-4 ${userInput.textStatus === 'block' ? 'hidden' : ''}">
              <label for="textInput" class="block font-bold mb-2">Challenge Description</label>
              <input id="textInput" type="text"
                placeholder="How would you like to describe your challenge?"
                value="${userInput.text}"
                class="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <button id="confirmText" class="w-full mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">
                Confirm
              </button>
            </div>
            
            <div class="${userInput.textStatus === 'block' ? '' : 'hidden'} space-y-4">
              <p class="text-xl text-white text-center bg-black bg-opacity-30 p-4 rounded-lg">
                ${userInput.text}
              </p>
              <button id="editText" class="w-full mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">
                Edit Description
              </button>
            </div>
          </div>

          <!-- Photo Upload Sections -->
          <div class="space-y-8">
            <div class="space-y-4">
              <h2 class="text-2xl font-bold mb-4">Upload Challenge Thumbnail</h2>
              <input type="file" id="uploadThumbnail" accept="image/*"
                class="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-white
                  hover:file:bg-blue-600">
              <div id="previewThumbnail" class="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4"></div>
            </div>

            <div class="space-y-4">
              <h2 class="text-2xl font-bold mb-4">Upload Background Image</h2>
              <input type="file" id="uploadBg" accept="image/*"
                class="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-white
                  hover:file:bg-blue-600">
              <div id="previewBg" class="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4"></div>
            </div>

          </div>

          <!-- Submit Button -->
          <button id="submitBtn" class="w-full mt-8 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">
            Create Challenge
          </button>
        </div>
      </div>
    </div>
    `;

    // Add event listeners for title input
    const titleInput = document.getElementById('titleInput');
    const confirmTitleBtn = document.getElementById('confirmTitle');
    const editTitleBtn = document.getElementById('editTitle');

    confirmTitleBtn?.addEventListener('click', () => {
      if (titleInput.value.trim()) {
        userInputs.title = titleInput.value;
        userInputs.titleStatus = 'block';
        renderPage();
      }
    });

    editTitleBtn?.addEventListener('click', () => {
      userInputs.titleStatus = 'hidden';
      renderPage();
    });

    // Add event listeners for text input
    const textInput = document.getElementById('textInput');
    const confirmTextBtn = document.getElementById('confirmText');
    const editTextBtn = document.getElementById('editText');

    confirmTextBtn?.addEventListener('click', () => {
      if (textInput.value.trim()) {
        userInputs.text = textInput.value;
        userInputs.textStatus = 'block';
        renderPage();
      }
    });

    editTextBtn?.addEventListener('click', () => {
      userInputs.textStatus = 'hidden';
      renderPage();
    });

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

    const confirmTitle = document.getElementById('confirmTitle');
    const confirmText = document.getElementById('confirmText');
    const uploadThumbnail = document.getElementById('uploadThumbnail');
    const uploadBg = document.getElementById('uploadBg');
    const submitBtn = document.getElementById('submitBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    if (uploadThumbnail) uploadThumbnail.onchange = () => setupImagePreview('uploadThumbnail');
    if (uploadBg) uploadBg.onchange = () => setupImagePreview('uploadBg');
    if (confirmTitle) confirmTitle.onclick = () => getInfoText('titleInput');
    if (confirmText) confirmText.onclick = () => getInfoText('textInput');
    if (submitBtn) submitBtn.onclick = () => uploadChallenge();
    if (logoutBtn) logoutBtn.onclick = () => logout();

  } 



  function getInfoText(slideTitle) {
    let slideId = slideTitle;
    let slideInput = document.getElementById(`${slideId}`).value;
    
    if (slideInput) {
        // Check if we already have an input for this slide
        let existingInput = userInputs[slideId.replace("Input", "")];
        
        if (existingInput) {
            // Update existing input
            existingInput = slideInput;
        } else {
            // Add new input
            userInputs[slideId.replace("Input", "")] = slideInput; 
        }
        
        // Update button text
        const button = document.getElementById(slideId);
        button.textContent = 'Update';
        
        // Add or update the "saved" message
        let savedMsg = document.querySelector(`#${slideId} + div.text-sm`);
        if (!savedMsg) {
            savedMsg = document.createElement('div');
            savedMsg.className = 'mt-2 text-sm text-gray-600';
            document.getElementById(slideId).parentNode.insertBefore(
                savedMsg,
                document.getElementById(slideId)
            );
        }
        savedMsg.innerHTML = '<em class="text-white">Previous input saved. Edit above to update your notes.</em>';
        textType =slideId.replace("Input", "");
        console.log(`${textType}Status`);
        userInputs[`${textType}Status`] = "block";
    }
  }

  function setupImagePreview(inputId)  {
    const preview = document.getElementById(inputId=='uploadThumbnail' ? 'previewThumbnail' : 'previewBg');
    const uploadInput = document.getElementById(inputId);   
    
    if (!uploadInput || !uploadInput.files || !uploadInput.files[0]) return;
    
    const file = uploadInput.files[0];
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
        userImg[inputId === 'uploadThumbnail' ? 0 : 1] = e.target.result;
        
        // Update preview only for thumbnail
        if (preview) {
          preview.innerHTML = '';
          const imageContainer = document.createElement('div');
          imageContainer.className = 'relative group';
          
          imageContainer.innerHTML = `
            <img src="${e.target.result}" 
                 alt="Preview" 
                 class="w-full h-48 object-cover rounded-lg">
            <button type="button"
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
            userImg[inputId === 'uploadThumbnail' ? 0 : 1] = null;
            uploadInput.value = ''; // Reset the file input
          };
          
          preview.appendChild(imageContainer);
        }
    };
    
    reader.readAsDataURL(file);
  }

  //function confirmImages() {
  //  renderPage();
  //}

  async function uploadChallenge() {
    userImg.forEach((_,index) => {
        if (userImg[index]){
            userImg[index] = userImg[index].split(",")[1];
            console.log(userImg[index]);
        }
    });
    if(!userInputs.title || !userInputs.text || !userImg[0] || !userImg[1]) {
        alert('Please fill in all the required fields');
        return;
    }
    // Create upload payload
    const uploadData = {
        action: "create challenge",
        role: "services",
        source: "platform",
        provider: window.businessName,
        type: "challenge",
        serviceID: userInputs.title,
        description: userInputs.text,
        images: userImg
    };
    window.updateServID(userInputs.title);
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
            document.getElementById('uploadThumbnail').value = '';
            document.querySelectorAll('.section-content textarea')
                .forEach(textarea => textarea.value = '');
        }, 2000);

        // Move to end section
        navigateTo('admin_challenge_locations.html');

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
  
          const responseData = await response.json();
          if (response.status === 200) {
              //updateDashboard(responseData.data);
              //return responseData.data;
              window.updateBusinessEmail(null);
              return responseData.message;
              //console.log(dashboardData);
          }
      } catch (error) {
          console.error('Error fetching dashboard data:', error);
      }
        window.updateBusinessEmail('default value');
        window.updateBusinessName('default value');
        window.updateServID('default value');
        window.location.href = 'index.html';
    }

  function navigateTo(page) {
    window.location.href = page;
  }
  
  renderPage();
});