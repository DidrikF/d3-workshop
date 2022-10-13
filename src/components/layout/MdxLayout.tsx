import { ReactNode } from "react";

export const MDXLayout = ({ children }: { children: ReactNode }) => {
  return <div className="markdown-body">{children}</div>;
};
