// A simple utility to recursively extract text from Tiptap/ProseMirror JSON
interface Node {
    type: string;
    content?: Node[];
    text?: string;
  }
  
  interface Document {
    content?: Node[];
  }
  
  export function getTextFromDoc(doc: Document | null | undefined): string {
    let text = '';
    
    if (doc && doc.content && Array.isArray(doc.content)) {
      doc.content.forEach((node: Node) => {
        if (node.type === 'text' && node.text) {
          text += node.text;
        } else if (node.content) {
          text += getTextFromDoc(node);
        }
        // Add a space between paragraphs for better readability and word separation
        if(node.type === 'paragraph' && text.length > 0) {
            text += ' ';
        }
      });
    }
  
    return text.trim();
  } 