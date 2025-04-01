import React from "react";
import PromptSuggestionButton from "./PromptSuggestionButton";

const PromptSuggestionsRow = ({ onPromptClick }: { onPromptClick: (prompt: string) => void }) => {
    const prompts = [
        "What is AIESEC?",
        "What is the AIESEC Exchange Program?",
        "What is the AIESEC Global Volunteer Program?",
        "What is the AIESEC Global Talent Program?",
        "What is the AIESEC Global Teacher Program?",]

    return (
        <div className="items-center justify-items-center">
            {prompts.map((prompt, index) => 
                <PromptSuggestionButton 
                    key={`suggestion-${index}`} 
                    text={prompt}
                    onClick={() => onPromptClick(prompt)}
                />)}
        </div>
    );
}

export default PromptSuggestionsRow;