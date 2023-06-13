  // Get active browser tab
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  let url = tabs[0].url;
  // Inject content script into the active tab
  chrome.scripting.executeScript(
    {
      target: { tabId: tabs[0].id },
      function: () => {
        const paragraphs = document.querySelectorAll('[class*="main"], [id*="main"]');
        const text = Array.from(paragraphs).map((p) => p.innerText).join("\n");
        return text;
      },
    },
    function (results) {
      function readingTime(text) {
        const wpm = 225;
        const words = text.trim().split(/\s+/).length;
        const time = Math.ceil(words / wpm);
        
        return time;
      }
      function calculateFleschKincaidReadability(text) {
        // Calculate the average number of syllables per word
        const words = text.match(/\b\w+\b/g);
        const totalSyllables = words.reduce((total, word) => total + countSyllables(word), 0);
        const averageSyllablesPerWord = totalSyllables / words.length;
      
        // Calculate the average number of words per sentence
        const sentences = text.match(/[.!?]+/g);
        const totalWords = words.length;
        const averageWordsPerSentence = totalWords / sentences.length;
      
        // Calculate the Flesch-Kincaid readability score
        const readabilityScore =
          0.39 * averageWordsPerSentence + 11.8 * averageSyllablesPerWord - 15.59;
      
        return readabilityScore.toFixed(2); // Return the score rounded to 2 decimal places
      }
      
      // Helper function to count the number of syllables in a word
      function countSyllables(word) {
        // Very basic syllable counting algorithm
        // Adjust or replace with a more accurate implementation if needed
        const syllables = word.toLowerCase().replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
          .match(/[aeiouy]{1,2}/g);
        return syllables ? syllables.length : 0;
      }


      document.getElementById("url").innerHTML = url;
      if (results[0].result.trim().split(/\s+/).length <= 1) {
        document.getElementById("content").innerHTML = "Nothing to see here!";
      }
      else {
        document.getElementById("count").innerHTML = "<span class='title'>Word Count: </span>" + results[0].result.trim().split(/\s+/).length;
        document.getElementById("readtime").innerHTML = "<span class='title'>Estimated Read Time: </span>" + readingTime(results[0].result) + " mins";
        document.getElementById("fkcount").innerHTML = "<span class='title'>Flesch-Kincaid Score: </span>" + calculateFleschKincaidReadability(results[0].result);
        // Display the text in popup
        document.getElementById("content").innerHTML = results[0].result;
      }
    }
  );
});