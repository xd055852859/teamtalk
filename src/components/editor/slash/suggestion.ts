import tippy from "tippy.js";
import { VueRenderer } from "@tiptap/vue-3";
import SlashList from "./slashList.vue";

import textSvg from "@/assets/editor/text.svg";
import h1Svg from "@/assets/editor/h1.svg";
import h2Svg from "@/assets/editor/h2.svg";
import h3Svg from "@/assets/editor/h3.svg";
import boldSvg from "@/assets/editor/bold.svg";
import italicSvg from "@/assets/editor/italic.svg";
import strikeSvg from "@/assets/editor/strike.svg";
import underlineSvg from "@/assets/editor/underline.svg";
import bulletListSvg from "@/assets/editor/bulletList.svg";
import dividerSvg from "@/assets/editor/divider.svg";
import orderListSvg from "@/assets/editor/orderList.svg";
import taskListSvg from "@/assets/editor/taskList.svg";
import codeSvg from "@/assets/editor/code.svg";
import blockquoteSvg from "@/assets/editor/blockquote.svg";
import codeBlockSvg from "@/assets/editor/codeBlock.svg";

const dark = localStorage.getItem("DARK");

export default {
  items: ({ query }) => {
    return [
      {
        title: "H1",
        icon: h1Svg,
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setHeading({ level: 1 })
            .run();
        },
      },
      {
        title: "H2",
        icon: h2Svg,
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setHeading({ level: 2 })
            .run();
        },
      },
      {
        title: "H3",
        icon: h3Svg,
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setHeading({ level: 3 })
            .run();
        },
      },
      {
        title: "bold",
        icon: boldSvg,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleBold().run();
        },
      },
      {
        title: "italic",
        icon: italicSvg,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleItalic().run();
        },
      },
      {
        title: "strike",
        icon: strikeSvg,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleStrike().run();
        },
      },
      {
        title: "underline",
        icon: underlineSvg,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleUnderline().run();
        },
      },
      {
        title: "bulletList",
        icon: bulletListSvg,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleBulletList().run();
        },
      },
      {
        title: "orderList",
        icon: orderListSvg,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleOrderedList().run();
        },
      },
      {
        title: "taskList",
        icon: taskListSvg,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleTaskList().run();
        },
      },
      {
        title: "blockquote",
        icon: blockquoteSvg,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setNode("blockquote").run();
        },
      },
      {
        title: "code",
        icon: codeSvg,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setMark("code").run();
        },
      },
      {
        title: "codeBlock",
        icon: codeSvg,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setNode("codeBlock").run();
        },
      },
    ]
      .filter((item) =>
        item.title.toLowerCase().startsWith(query.toLowerCase())
      )
      .slice(0, 10);
  },

  render: () => {
    let component;
    let popup;

    return {
      onStart: (props) => {
        component = new VueRenderer(SlashList, {
          // using vue 2:
          // parent: this,
          // propsData: props,
          props,
          editor: props.editor,
        });

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },

      onUpdate(props) {
        component.updateProps(props);

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props) {
        if (props.event.key === "Escape") {
          popup[0].hide();

          return true;
        }
        if (component.ref) {
          return component.ref?.onKeyDown(props);
        }
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
};
