import { useState } from "react";

const UserSuggestion = (props) => {
    const [userProvidedCorrection, setUserProvidedCorrection] = useState("");
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (userProvidedCorrection.trim() === "") {
          return alert("Users correction cannot be empty.");
        }
        const sentence=props.randomText;
        const suggestions= props.suggestionsText;
        const userSuggestion = userProvidedCorrection;
        const formData = { sentence, suggestions,userSuggestion };

        console.log(formData);
        try {
            const response = await fetch("/api/save-correction", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            body: JSON.stringify(formData),
            });
            if (response.ok) {
              console.log("Form data submitted successfully");
              window.location.reload();
              document.getElementById("myForm").reset();

              setUserProvidedCorrection("");

            } else {
              console.error("Form data submission failed");
            }
          } catch (error) {
            console.log("Error submitting form:", error);
            document.getElementById("myForm").reset();

          }
          let randomNumber = Math.random() * 1000;
					props.setNextOriginalText(randomNumber);

      };

    return (
			<div>
				<h3>Or Enter your own Correction:</h3>
                <form id = "myForm" onSubmit={handleSubmit}>
                <input type="text" name="suggestion" className="suggestionInput" placeholder="Type correction" id="userProvidedCorrection" value={userProvidedCorrection}onChange={(event) => setUserProvidedCorrection(event.target.value)}
                required
 ></input>
				<button className="correctionButton" type="submit">Save Correction</button>
                </form>
			</div>
		);
};

export default UserSuggestion;

