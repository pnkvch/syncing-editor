import React, { useState, useRef, useEffect } from "react";
import { Editor } from "slate-react";
import { initialValue } from "./slateInitialValue";
import io from "socket.io-client";

const socket = io("http://localhost:4000/");

const SyncingEditor = () => {
  const [value, setValue] = useState(initialValue);
  const editor = useRef(null);
  const remote = useRef(false);
  const id = useRef(`${Date.now()}`);

  useEffect(() => {
    socket.on("new-remote-operation", ({ editorId, operations }) => {
      if (id.current !== editorId) {
        operations.forEach(o => {
          remote.current = true;
          editor.current.applyOperation(o);
          remote.current = false;
        });
      }
    });
  }, []);

  const onChange = ({ value, operations }) => {
    const ops = operations
      .filter(
        o =>
          o.type !== "set_selection" &&
          o.type !== "set_value" &&
          (!o.data || !o.data.has("source"))
      )
      .toJS()
      .map(o => ({ ...o, data: { source: "one" } }));
    setValue(value);
    if (ops.length) {
      socket.emit("new-operation", {
        editorId: id.current,
        operations: ops
      });
    }
  };

  return (
    <Editor
      style={{
        backgroundColor: "#fafafa",
        maxWidth: 800,
        margin: "auto",
        height: 100
      }}
      ref={editor}
      value={value}
      onChange={onChange}
    />
  );
};

export default SyncingEditor;
