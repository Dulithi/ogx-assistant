import React from "react";
import PromptSuggestionButton from "./PromptSuggestionButton";

const PromptSuggestionsRow = ({ onPromptClick }: { onPromptClick: (prompt: string) => void }) => {
    // List of predefined prompts to help users ask relevant questions
    const prompts = [
        "What is AIESEC?",
        "What is the AIESEC Exchange Program?",
        "What is the AIESEC Global Volunteer Program?",
        "What is the AIESEC Global Talent Program?",
        "What is the AIESEC Global Teacher Program?",
    ];

    return (
        <div className="flex justify-center items-center flex-wrap gap-2">
            {prompts.map((prompt, index) => (
                <PromptSuggestionButton 
                    key={`suggestion-${index}`} 
                    text={prompt} // Set button label to the prompt text
                    onClick={() => onPromptClick(prompt)} 
                />
            ))}
        </div>
    );
}

export default PromptSuggestionsRow;
