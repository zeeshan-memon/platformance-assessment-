export const generateTitle = (text: string): string => {
    
    return text
      .toLowerCase()
      .split(" ")
      .map((word, index) =>
        ["a", "an", "the", "of", "in", "on", "at", "to", "for", "with", "and", "but", "or"].includes(word) && index !== 0
          ? word
          : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  };
  