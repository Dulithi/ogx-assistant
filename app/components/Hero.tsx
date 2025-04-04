import PromptSuggestionsRow from "./PromptSuggestionsRow";

const Hero = ({ handlePrompt } : {handlePrompt : (prompt: string) => Promise<void> }) => {
    return (
        <section className="flex-grow flex flex-col justify-end px-10 pt-10 pb-4">
        <header className="m-auto flex flex-col sm:gap-5 gap-2 text-center">
        <h1 className=" text-center font-extrabold sm:text-5xl text-3xl m-6 pt-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r to-gv from-gta via-gte">oGX Assistant</span>
        </h1>
        <p className="text-muted-foreground sm:text-sm text-xs">
        Clarify your doubts about the AIESEC Exchange program!
        </p>
        <br />
        <PromptSuggestionsRow onPromptClick={handlePrompt} />
      </header>
      </section>
  );
}

export default Hero;

