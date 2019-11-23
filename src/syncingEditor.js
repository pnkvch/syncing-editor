import React, { useState, useRef, useEffect } from "react";
import { Editor } from "slate-react";
import { Value } from "slate";
import { initialValue } from "./slateInitialValue";
import io from "socket.io-client";

const socket = io("http://localhost:4000/");

const SyncingEditor = ({ groupId }) => {
  const [value, setValue] = useState(initialValue);
  const editor = useRef(null);
  const id = useRef(`${Date.now()}`);

  useEffect(() => {
    fetch(`http://localhost:4000/groups/${groupId}`).then(x => {
      x.json().then(data => {
        setValue(Value.fromJSON(data));
      });
    });

    const eventName = `new-remote-operation-${groupId}`;

    socket.on(eventName, ({ editorId, operations }) => {
      if (id.current !== editorId) {
        operations.forEach(o => {
          editor.current.applyOperation(o);
        });
      }
    });

    return () => {
      socket.off(eventName);
    };
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
        operations: ops,
        value: value,
        groupId
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
