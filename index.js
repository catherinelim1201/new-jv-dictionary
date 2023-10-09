// Constants for selectors
const ERROR_MESSAGE_SELECTOR = ".error-message";
const LIST_GROUP_SELECTOR = ".list-group";
const PHONETICS_CONTAINER_SELECTOR = ".phonetics-container";
const CARD_HEADER_SELECTOR = ".card-header";

// Cached DOM elements
const errorMessageElement = document.querySelector(ERROR_MESSAGE_SELECTOR);
const listGroupElement = document.querySelector(LIST_GROUP_SELECTOR);
const phoneticsContainerElement = document.querySelector(PHONETICS_CONTAINER_SELECTOR);
const cardHeaderElement = document.querySelector(CARD_HEADER_SELECTOR);

// Function to check if word exist
const wordExist = (response) => {
  const word = response.data[0].word

  return word.length !== 0
}

// Function to display phonetics
const displayPhonetics = (response) => {
  const phonetics = response.data[0].phonetics;

  // Clear phonetics container
  phoneticsContainerElement.innerHTML = "";

  if (!wordExist(response)) {
    // Hide phonetics container if no phonetics are available
    phoneticsContainerElement.style.display = "none";
  } else if (phonetics.length > 0) {
    // Show phonetics container
    phoneticsContainerElement.style.display = "block";

    phonetics.forEach((phonetic) => {
      if (phonetic.audio || phonetic.text && wordExist(response)) {
        const phoneticElement = document.createElement("div");

        if (phonetic.audio) {
          const phoneticText = document.createElement("p");
          phoneticElement.appendChild(phoneticText);
          phoneticText.textContent = phonetic.text;

          const audioElement = document.createElement("audio");
          audioElement.controls = true;
          audioElement.src = phonetic.audio;

          phoneticElement.appendChild(audioElement);

          } else {
            const phoneticText = document.createElement("p");
            phoneticElement.appendChild(phoneticText);
            phoneticText.textContent = phonetic.text;
          }

        phoneticsContainerElement.appendChild(phoneticElement);
        }

    });
  }
};

// Function to display error messages
const displayErrorMessage = (message) => {
  errorMessageElement.textContent = message;
  errorMessageElement.style.display = "block";
};

// Function to clear error messages and definitions
const clearErrorMessage = () => {
  errorMessageElement.textContent = "";
  errorMessageElement.style.display = "none";
};

// Function to clear displayed definitions
const clearDefinition = () => {
  listGroupElement.innerHTML = "";
  listGroupElement.style.display = "none";
};

// Function to clear error messages and definitions
const clearErrors = () => {
  clearErrorMessage()
  clearDefinition()
}

// Function to update word definition
const updateDefinition = (response) => {
  const definition = response.data[0].meanings
  const showDefinition = document.querySelector(LIST_GROUP_SELECTOR)

  showDefinition.innerHTML = ""

  if (definition.length === 0) {
    showDefinition.style.display = "none"
  } else {
    showDefinition.style.display = "block"
    definition.forEach((meaning) => {
      const listMeaning = document.createElement("li")
      listMeaning.textContent = meaning.definitions[0].definition
      showDefinition.appendChild(listMeaning)
    })
  }
}

// Function to update displayed word
const updateWord = (response) => {
  const word = response.data[0].word;

  if (word.length === 0) {
    cardHeaderElement.style.display = "none";
  } else {
    cardHeaderElement.style.display = "block";
    cardHeaderElement.innerHTML = word;
  }
};

// Function to display word, definition, and audio
const displayWord = (response) => {
  // Check if the word exists
  const word = response.data[0].word;

  if (word.length === 0) {
    // Hide word if it doesn't exist
    cardHeaderElement.style.display = "none";
  } else {
    // Show word if it exists
    cardHeaderElement.style.display = "block";
    cardHeaderElement.innerHTML = word;

    // Update definition and phonetics
    updateDefinition(response);
    displayPhonetics(response);
  }
};

// Function to search for a word
const searchWord = (word) => {
  const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

  axios
    .get(apiUrl)
    .then(displayWord)
    .catch((error) => {
      console.error("Error fetching data:", error);
      displayErrorMessage("Sorry pal, we couldn't find definitions for the word you were looking for. You can try the search again at later time or head to the web instead.");
      clearDefinition();
    });
};

// Function to handle form submission
const handleSubmit = (event) => {
  event.preventDefault();
  const inputValue = inputField.value;

  if (inputValue === "") {
    clearErrors();
  } else {
    clearErrors();
    searchWord(inputValue);
  }
};

// Event listener for the form
const form = document.querySelector(".input-group");
const inputField = document.querySelector(".form-control");

form.addEventListener("input", handleSubmit);
