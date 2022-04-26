import tippy from "tippy.js";
import { VueRenderer } from "@tiptap/vue-3";
import SlashList from "./slashList.vue";

import boldSvg from "@/assets/editor/bold.svg";
import italicSvg from "@/assets/editor/italic.svg";
import strikeSvg from "@/assets/editor/strike.svg";
import underlineSvg from "@/assets/editor/underline.svg";
import textSvg from "@/assets/editor/text.svg";
import h1Svg from "@/assets/editor/h1.svg";
import h2Svg from "@/assets/editor/h2.svg";
import h3Svg from "@/assets/editor/h3.svg";
import bulletListSvg from "@/assets/editor/bulletList.svg";
import dividerSvg from "@/assets/editor/divider.svg";
import orderListSvg from "@/assets/editor/orderList.svg";
import taskListSvg from "@/assets/editor/taskList.svg";
import codeSvg from "@/assets/editor/code.svg";
import blockquoteSvg from "@/assets/editor/blockquote.svg";
import codeBlockSvg from "@/assets/editor/codeBlock.svg";
import imgSvg from "@/assets/editor/img.svg";
import imgwSvg from "@/assets/editor/imgw.svg";
import textwSvg from "@/assets/editor/textw.svg";
import h1wSvg from "@/assets/editor/h1w.svg";
import h2wSvg from "@/assets/editor/h2w.svg";
import h3wSvg from "@/assets/editor/h3w.svg";
import bulletListwSvg from "@/assets/editor/bulletListw.svg";
import dividerwSvg from "@/assets/editor/dividerw.svg";
import orderListwSvg from "@/assets/editor/orderListw.svg";
import taskListwSvg from "@/assets/editor/taskListw.svg";
import codewSvg from "@/assets/editor/codew.svg";
import blockquotewSvg from "@/assets/editor/blockquotew.svg";
import codeBlockwSvg from "@/assets/editor/codeBlockw.svg";
import boldwSvg from "@/assets/editor/boldw.svg";
import italicwSvg from "@/assets/editor/italicw.svg";
import strikewSvg from "@/assets/editor/strikew.svg";
import underlinewSvg from "@/assets/editor/underlinew.svg";
const dark = localStorage.getItem("DARK");

export default {
  items: ({ query }) => {
    return [
      {
        title: "H1",
        icon: dark ? h1wSvg : h1Svg,
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
        icon: dark ? h2wSvg : h2Svg,
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
        icon: dark ? h3wSvg : h3Svg,
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
        title: "img",
        icon: dark ? imgwSvg : imgSvg,
        command: ({ editor, range, props }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setImage({ src: props.url })
            .run();
        },
      },
      // {
      //   title: "bold",
      //   icon: dark ? boldwSvg : boldSvg,
      //   command: ({ editor, range }) => {
      //     editor.chain().focus().deleteRange(range).toggleBold().run();
      //   },
      // },
      // {
      //   title: "italic",
      //   icon: dark ? italicwSvg : italicSvg,
      //   command: ({ editor, range }) => {
      //     editor.chain().focus().deleteRange(range).toggleItalic().run();
      //   },
      // },
      // {
      //   title: "strike",
      //   icon: dark ? strikewSvg : strikeSvg,
      //   command: ({ editor, range }) => {
      //     editor.chain().focus().deleteRange(range).toggleStrike().run();
      //   },
      // },
      // {
      //   title: "underline",
      //   icon: dark ? underlinewSvg : underlineSvg,
      //   command: ({ editor, range }) => {
      //     editor.chain().focus().deleteRange(range).toggleUnderline().run();
      //   },
      // },
      {
        title: "bulletList",
        icon: dark ? bulletListwSvg : bulletListSvg,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleBulletList().run();
        },
      },
      {
        title: "orderList",
        icon: dark ? orderListwSvg : orderListSvg,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleOrderedList().run();
        },
      },
      {
        title: "taskList",
        icon: dark ? taskListwSvg : taskListSvg,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleTaskList().run();
        },
      },
      // {
      //   title: "blockquote",
      //   icon: dark ? blockquoteSvg : blockquotewSvg,
      //   command: ({ editor, range }) => {
      //     editor.chain().focus().deleteRange(range).setNode("blockquote").run();
      //   },
      // },
      {
        title: "code",
        icon: dark ? codewSvg : codeSvg,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setMark("code").run();
        },
      },
      {
        title: "codeBlock",
        icon: dark ? codeBlockwSvg : codeBlockSvg,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setNode("codeBlock").run();
        },
      },
      {
        title: "divider",
        icon: dark ? dividerwSvg : dividerSvg,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setHorizontalRule().run();
        },
      },
    ].filter((item) =>
      item.title.toLowerCase().startsWith(query.toLowerCase())
    );
    // .slice(0, 10);
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
        return component.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
};
