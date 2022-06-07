import { Node, mergeAttributes } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import StarNode from "./starItem.vue";

export type StarOptions = {
  HTMLAttributes: Record<string, any>;
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    star: {
      /**
       * Set a heading node
       */
      setStar: () => ReturnType;
      /**
       * Toggle a heading node
       */
    };
  }
}

export const Star = Node.create<StarOptions>({
  name: "star",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },
  addAttributes() {
    return {
      count: {
        default: 0,
      },
    };
  },

  group: "block",

  parseHTML() {
    return [{ tag: "star" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["star", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return VueNodeViewRenderer(StarNode);
  },

  addCommands() {
    return {
      setStar:
        () =>
        ({ commands }) => {
          return commands.insertContent("<star></star>");
        },
    };
  },
});
