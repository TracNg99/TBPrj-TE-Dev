document.addEventListener("DOMContentLoaded", async () => {
  const appContainer = document.getElementById('app');
  let data;
  let serverURL = "https://us-central1-travel-app-practice-441004.cloudfunctions.net/httpRouting_WebClientVer";
  let responseMessage = "";

  function renderPage(challenge) {
    appContainer.innerHTML = `
      <div class="relative w-full h-screen text-white">

          <img src="background.jpg" 
               alt="Background" 
               class="w-full h-full object-cover opacity-90 brightness-50">
        
            <div class="absolute top-10 left-20 transform -translate-x-1/2">
            <button id="PrevPage" 
                    class="px-5 py-3 bg-primary text-white text-xl rounded-lg 
                           hover:bg-blue-600 transform hover:scale-105 
                           transition-all duration-200 shadow-lg">
              Back to Portal
            </button>
            </div>   

          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <h1 class="text-2xl md:text-6xl font-bold mb-4">${challenge.serviceID || ''}</h1>
            <h1 class="text-lg md:text-2xl mb-4">Welcome to aboard!</h1>
            <p class="text-lg md:text-xl mb-8">Let's capture your traveling moments together!</p>
            <p class="text-lg md:text-xl mb-8">
              Description: ${challenge.description || ''}
            </p>
          </div>
          
          <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <button id="toNav" 
                    class="px-8 py-3 bg-primary text-white text-xl rounded-lg 
                           hover:bg-blue-600 transform hover:scale-105 
                           transition-all duration-200 shadow-lg">
              Begin
            </button>
          </div>
      </div>
    `;
    
    document.getElementById("toNav").onclick = () => navigateTo("sections.html");
    document.getElementById("PrevPage").onclick = () => navigateTo("userportal.html");
  } 

  async function fetchChallengesContent() {
    let uploadInfoText = {
        action: "get service", 
        collections: "services", 
        searchField: "serviceID",
        value: window.serviceID
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
      return responseMessage.data[0];

    } catch (error) {
      console.error(error);
    }
  }


  //async function bookChallenge() {
  //  const uploadData = {
  //    action: "challenge input",
  //    role: "booking",
  //    provider: window.provider,
  //    serviceID: window.serviceID,
  //    useremail: window.signInEmail,
  //    type: "challenge",
  //    created: new Date().toISOString()
  //  };

  //  try {
  //    const response = await fetch(requestLink, {
  //        method: 'POST',
  //       headers: {
  //            "Content-Type": "application/json",
  //        },
  //        body: JSON.stringify(uploadData)
  //    });

  //    if (!response.ok) {
  //        throw new Error('Failed to upload content');
 //     }
  //  } catch (error) {
  //    console.error('Error uploading content:', error);
  //  }
  //}
  
  function navigateTo(page) {
    if (page == "userportal.html") {
      window.updateServID('');
    } 
    window.location.href = page;
  }

  data = await fetchChallengesContent();
  renderPage(data);
});