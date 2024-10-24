const insertToTextArea = (insertString: string) => {
    const textarea = document.querySelector('textarea');
    if (!textarea) {
      return null;
    }
  
    const sentence = textarea.value;
    const pos = textarea.selectionStart;
    
    const newSentence = sentence.slice(0, pos) + insertString + sentence.slice(pos);
    
    textarea.value = newSentence;
    textarea.selectionEnd = pos + insertString.length;
  
    return newSentence;
  };
  
  export default insertToTextArea;