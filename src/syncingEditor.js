import React, { useState, useRef, useEffect } from "react";
import { Editor } from "slate-react";
import { initialValue } from "./slateInitialValue";
import Mitt from "mitt";

const emitter = new Mitt();

const SyncingEditor = () => {
  const [value, setValue] = useState(initialValue);
  const editor = useRef(null);
  const remote = useRef(false);
  const id = useRef(`${Date.now()}`);

  useEffect(() => {
    emitter.on("*", (type, ops) => {
      if (id.current !== type) {
        ops.forEach(o => {
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
      emitter.emit(id.current, ops);
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
