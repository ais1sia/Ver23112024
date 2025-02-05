import React, { useState } from "react";
import {
  Editor,
  EditorState,
  ContentState,
} from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import "draft-js/dist/Draft.css";

const RichTextEditor = ({ initialContent = "", onContentChange }) => {
  const [editorState, setEditorState] = useState(() => {
    if (initialContent) {
      const contentState = ContentState.createFromText(initialContent);
      return EditorState.createWithContent(contentState);
    }
    return EditorState.createEmpty();
  });

  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState);

    const contentHTML = stateToHTML(newEditorState.getCurrentContent());
    onContentChange(contentHTML);
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: "10px", minHeight: "200px" }}>
      <Editor editorState={editorState} onChange={handleEditorChange} />
    </div>
  );
};

export default RichTextEditor;
