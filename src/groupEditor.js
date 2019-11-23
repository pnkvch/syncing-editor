import React from "react";
import SyncingEditor from "./syncingEditor";

const GroupComponent = ({
  match: {
    params: { id }
  }
}) => {
  return (
    <div>
      <SyncingEditor groupId={id} />
    </div>
  );
};

export default GroupComponent;
