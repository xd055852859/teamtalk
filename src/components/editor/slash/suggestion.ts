import tippy from "tippy.js";
import { VueRenderer } from "@tiptap/vue-3";
import SlashList from "./slashList.vue";

export default {
  items: ({ editor, query }) => {
    const isTable = editor.isActive("table");
    if (isTable) {
      return [
        {
          title: "addColumnBefore",
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).addColumnBefore().run();
          },
        },
        {
          title: "addColumnAfter",
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).addColumnAfter().run();
          },
        },
        {
          title: "deleteColumn",
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).deleteColumn().run();
          },
        },
        {
          title: "addRowBefore",
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).addRowBefore().run();
          },
        },
        {
          title: "addRowAfter",
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).addRowAfter().run();
          },
        },
        {
          title: "deleteRow",
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).deleteRow().run();
          },
        },
        {
          title: "deleteTable",
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).deleteTable().run();
          },
        },
        {
          title: "bold",
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setMark("bold").run();
          },
        },
        {
          title: "italic",
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setMark("italic").run();
          },
        },
        {
          title: "strike",
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setMark("strike").run();
          },
        },
        {
          title: "progress",
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setProgress().run();
          },
        },
        {
          title: "star",
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setStar().run();
          },
        },
        {
          title: "img",
          type: "common",
          command: ({ editor, range, props }) => {
            console.log(props.props.url);
            if (props.props.index) {
              editor
                .chain()
                .insertContent(`<p><img src="${props.props.url}"/></p>`)
                .run();
            } else {
              editor
                .chain()
                .deleteRange(range)
                .insertContent(`<p><img src="${props.props.url}"/></p>`)
                .run();
            }
          },
        },
      ].filter((item) =>
        item.title.toLowerCase().startsWith(query.toLowerCase())
      );
    }
    return [
      {
        title: "h1",
        type: "common",
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
        type: "common",
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
        type: "common",
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
        type: "common",
        command: ({ editor, range, props }) => {
          console.log(props.props.url);
          if (props.props.index) {
            editor
              .chain()
              .insertContent(`<p><img src="${props.props.url}"/></p>`)
              .run();
          } else {
            editor
              .chain()
              .deleteRange(range)
              .insertContent(`<p><img src="${props.props.url}"/></p>`)
              .run();
          }
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
        type: "common",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setProgress().run();
        },
      },
      {
        title: "star",
        type: "common",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setStar().run();
        },
      },
      {
        title: "bulletList",
        type: "common",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleBulletList().run();
        },
      },
      {
        title: "orderList",
        type: "common",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleOrderedList().run();
        },
      },
      {
        title: "taskList",
        type: "common",
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
        type: "common",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setMark("code").run();
        },
      },
      {
        title: "codeBlock",
        type: "common",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setNode("codeBlock").run();
        },
      },
      {
        title: "divider",
        type: "common",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setHorizontalRule().run();
        },
      },
      {
        title: "table",
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            // 在表格后插入一行
            .insertContent({
              type: "paragraph",
            })
            .setTextSelection(range)
            .insertTable({ rows: 4, cols: 3, withHeaderRow: true })
            .run();
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
