const OriginalSentence = (props) => {

    return (
        <div>
            <h3>Original Sentence :</h3>
            <button>
                {props.text}
            </button>

        </div>
    );
};

export default OriginalSentence;