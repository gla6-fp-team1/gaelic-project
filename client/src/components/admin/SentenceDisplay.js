import { useState, useEffect } from "react";
import SuggestionTable from "./SuggestionTable";

const SentenceDisplay = ({ setAlertMessage, sentenceId }) => {
	const [sentenceData, setSentenceData] = useState(null);

	useEffect(() => {
		async function fetchSentence(sentenceId) {
			const response = await fetch(`/api/sentences/${sentenceId}`);
			const responseData = await response.json();
			if (responseData.success) {
				setSentenceData(responseData.data);
			} else {
				setAlertMessage(responseData);
			}
		}
		setSentenceData(null);
		if (sentenceId) {
			fetchSentence(sentenceId);
		}
	}, [sentenceId, setAlertMessage]);

	return (
		<>
			{sentenceId && sentenceData && (
				<div className="statistics">
					<h2>Sentence Statistics</h2>
					<p>
						<b>Sentence</b>: {sentenceData.sentence}
					</p>
					<ul>
						<li>
							Logged in:
							<ul>
								<li>
									Suggestions:
									<ul>
										{sentenceData.stats.logged.suggestions.map((s) => (
											<li key={`${s.suggestion}-${s.count}`}>
												<span className="suggestion-element">
													{s.suggestion}
												</span>
												: {s.count}
											</li>
										))}
									</ul>
								</li>
								<li>
									Interaction types:
									<ul>
										{sentenceData.stats.logged.types.map((s) => (
											<li key={`${s.type}-${s.count}`}>
												<span className="type-element">{s.type}</span>:{" "}
												{s.count}
											</li>
										))}
									</ul>
								</li>
							</ul>
						</li>
						<li>
							Anonymous:
							<ul>
								<li>
									Suggestions:
									<ul>
										{sentenceData.stats.anonymous.suggestions.map((s) => (
											<li key={`${s.suggestion}-${s.count}`}>
												<span className="suggestion-element">
													{s.suggestion}
												</span>
												: {s.count}
											</li>
										))}
									</ul>
								</li>
								<li>
									Interaction types:
									<ul>
										{sentenceData.stats.anonymous.types.map((s) => (
											<li key={`${s.type}-${s.count}`}>
												<span className="type-element">{s.type}</span>:{" "}
												{s.count}
											</li>
										))}
									</ul>
								</li>
							</ul>
						</li>
					</ul>
					<h3>User provided suggestions</h3>
					<SuggestionTable
						sentenceId={sentenceId}
						setAlertMessage={setAlertMessage}
					/>
				</div>
			)}
		</>
	);
};
export default SentenceDisplay;
