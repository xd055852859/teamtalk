import tippy from "tippy.js";
import { VueRenderer } from "@tiptap/vue-3";
import SlashList from "./slashList.vue";

export default {
  items: ({ query }) => {
    return [
      {
        title: "h1",
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
        title: "h2",
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
        title: "h3",
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setHeading({ level: 4 })
            .run();
        },
      },
      {
        title: "img",
        command: ({ editor, range, props }) => {
          console.log(props.props.url);
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setImage({ src: props.props.url })
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
      {
        title: "progress",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setProgress().run();
        },
      },
      {
        title: "bulletList",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleBulletList().run();
        },
      },
      {
        title: "orderList",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleOrderedList().run();
        },
      },
      {
        title: "taskList",
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
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setMark("code").run();
        },
      },
      {
        title: "codeBlock",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setNode("codeBlock").run();
        },
      },
      {
        title: "divider",
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
