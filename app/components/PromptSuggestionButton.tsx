const PromptSuggestionButton = ({text, onClick}: { text: string; onClick: () => void }) => {
    return (
        <button 
            className="whitespace-nowrap text-aiesec-blue bg-a-gray border border-aiesec-blue
                focus:outline-none hover:bg-gray-100 focus:ring-5 focus:ring-gray-100 
                font-medium rounded-4xl text-sm sm:text-3xm  px-5 py-2.5 me-2 mb-2 
                dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700
                dark:hover:border-gray-600 dark:focus:ring-gray-700 t"
            onClick={onClick}
        >
            {text}
        </button>
    );
}

export default PromptSuggestionButton;