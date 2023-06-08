const grabBtn = document.getElementById("grabBtn");

grabBtn.addEventListener("click", () => {
  // Get active browser tab
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // Inject content script into the active tab
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        function: () => {
          const paragraphs = document.querySelectorAll("#maincontent");
          const text = Array.from(paragraphs).map((p) => p.innerText).join("\n");
          return text;
        },
      },
      function (results) {
        // Display the text in an alert
        document.getElementById("content").innerHTML = (results[0].result);
      }
    );
  });
});
