// grabs the desired language
const dropdown = document.getElementById("myDropdown");

const selectedLanguage = dropdown.value; // Grabs the attribute
const selectedLanguageText = dropdown.options[dropdown.selectedIndex].text; // Grabs the actual text inside



// This is for the response page -- looking to see if it outputs our response
document.getElementById("userInputForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevents a default form submission

    // grab what is put in by user
    const textToSimplify = document.getElementById('userTextSimplification').value;

    // This is where we do something with the collected data -- send it to API? tbd
    document.getElementById("response").innerHTML = '<p> Generated Simplificaiton </p>';

});