import { Node, mergeAttributes } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import ProgressItem from "./progressItem.vue";
export type ProgressOptions = {
  HTMLAttributes: Record<string, any>;
};
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    progress: {
      /**
       * Set a heading node
       */
      setProgress: () => ReturnType;
      /**
       * Toggle a heading node
       */
    };
  }
}

export const Progress = Node.create<ProgressOptions>({
  name: "progress",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },
  addAttributes() {
    return {
      percent: {
        default: 0,
      },
    };
  },
  // group: "block",
  group: "block",

  parseHTML() {
    return [{ tag: "progress" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["progress", mergeAttributes(HTMLAttributes)];
  },
  addNodeView() {
    return VueNodeViewRenderer(ProgressItem);
  },
  addCommands() {
    return {
      setProgress:
        () =>
        ({ commands }) => {
          return commands.insertContent("<progress></progress>");
        },
    };
  },
});
