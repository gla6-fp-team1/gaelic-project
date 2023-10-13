
import { useState } from "react";
const IsOriginalSentenceCorrect= (props) => {
    const [selectedOption, setSelectedOption] = useState("");
      const handleSubmit = async (event) => {
        event.preventDefault();
        if (selectedOption !== "Correct") {
          event.preventDefault();
          alert("Are you sure the sentence correct? select Correct.");
        }
        const sentence = props.randomText;
        const suggestions = props.suggestionsText;
        const originalSentenceWasCorrect = selectedOption;
        const formData = { sentence, suggestions,originalSentenceWasCorrect };

        try {
            const response = await fetch("/api/save-corrections", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            body: JSON.stringify(formData),
            });
            if (response.ok) {
              console.log("Form data submitted successfully");
               setSelectedOption("");

            } else {
              console.error("Form data submission failed");
            }
          } catch (error) {
            console.log("Error submitting form:", error);


          }
      };

    return (
			<div>
				<form id="myFormOriginal" onSubmit={handleSubmit}>
  <label htmlFor="isOriginalSentence">Is Original Sentence Correct:</label>
                <select className="isOriginalSentenceCorrect" name="isOriginalSentence"value={selectedOption}
        onChange={(event) => setSelectedOption(event.target.value)}
>
                    <option value="empty field"></option>
                    <option value="Correct">Correct</option>

                </select>
         <button type="submit" className="isOriginSubmit"  onClick={() => {
  setTimeout(() => {
if(selectedOption==="Correct"){
    let randomNumber = Math.random() * 1000;
    props.setNextOriginalText(randomNumber);
    window.location.reload();
}else{
      setSelectedOption("");
    }


  }, 1000);
}}>Submit</button>
</form>

			</div>
		);
};

export default IsOriginalSentenceCorrect;
