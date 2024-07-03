export function capitalizeWorld(word) {
    return (
      word.charAt(0).toUpperCase() +
      word.slice(1).toLowerCase()
    );
  }