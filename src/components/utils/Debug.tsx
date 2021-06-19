import React, { FunctionComponent, useCallback, useState } from "react";
import { makeStyles } from "@material-ui/core";
import classNames from "classnames";

const useStyles = makeStyles({
  root: {
    background: "lightgray",
  },
  wrapper: {
    background: "gray",
    overflow: "hidden",
    height: 5,
    "&:hover": {
      height: 10,
    },
  },
  wrapperEnabled: {
    height: "auto",
    "&:hover": {
      height: "auto",
    },
  },
});

const off = process.env.NODE_ENV === "production";

type DebugProps = {
  it: any;
  force?: boolean;
  disable?: boolean;
  wrapper?: boolean;
};

// Prevents circular refs
function replacer() {
  const seen = new WeakSet();
  return (key: any, value: any) => {
    if (value && value.type === "Buffer") {
      return "buffer";
    }
    
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

//function replacer(name: any, val: any) {
//  if (val && val.type === "Buffer") {
//    return "buffer";
//  }
//  return val;
//}

type DebugWrapperProps = {
  enabled: boolean;
};

const DebugWrapper: FunctionComponent<DebugWrapperProps> = ({
  enabled,
  children,
}) => {
  const classes = useStyles();
  const [show, setShow] = useState(false);
  const toggleShow = useCallback(() => {
    setShow(!show);
  }, [show]);
  if (!enabled) {
    return <>{children}</>;
  }
  const className = classNames(classes.wrapper, {
    [classes.wrapperEnabled]: show,
  });
  return (
    <div className={className} onClick={toggleShow}>
      {children}
    </div>
  );
};

export const Debug: FunctionComponent<DebugProps> = ({
  it,
  force,
  disable,
  wrapper,
  children,
}) => {
  const classes = useStyles();
  const target = it || children;
  const show = !off || force;
  const noClick = useCallback((event) => {
    event.stopPropagation();
  }, []);
  return show && !disable ? (
    <DebugWrapper enabled={!!wrapper}>
      <pre className={classes.root} onClick={noClick}>
        {JSON.stringify(target, replacer(), 2)}
      </pre>
    </DebugWrapper>
  ) : null;
};

export const DebugComponentProps: FunctionComponent<any> = (props) => (
  <Debug it={props} />
);
