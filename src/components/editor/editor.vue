<script setup lang="ts">
import {
  EditorContent,
  JSONContent,
  useEditor,
  FloatingMenu,
} from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Link from "@tiptap/extension-link";
import IconFont from "@/components/iconFont.vue";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Progress from "@/components/editor/progress";
import Star from "@/components/editor/star";
import i18n from "@/language/i18n";
import { Card } from "@/interface/Message";
import { ElMessage } from "element-plus";
import { useStore } from "@/store";
import EditorNav from "./editorNav.vue";
import { uploadImage } from "@/services/util";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";

import Slash from "./slash/slashs";
import slashSuggestion from "./slash/suggestion";
import { BubbleMenu } from "./bubble-menu/BubbleMenu";
import { isArray } from "@vue/shared";
// import suggestion1 from "./suggestion1";

const router = useRouter();
const props = defineProps<{
  initData?: Card | null;
  isEdit: boolean;
  cardKey?: string;
  shake: boolean;
}>();
const store = useStore();
const dark = computed(() => store.state.common.dark);
const editKey = computed(() => store.state.message.editKey);
const editContent = computed(() => store.state.message.editContent);
const updateState = computed(() => store.state.common.updateState);
const uploadToken = computed(() => store.state.auth.uploadToken);
const editor = useEditor({
  content: {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 2 },
      },
      {
        type: "paragraph",
        content: [],
      },
    ],
  },
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: ({ node }) => {
        const placeholderTitle = i18n.global.t(`input['Enter title ...']`);
        const placeholderStr = i18n.global.t(
          `input["Enter text,or type '/' to select"]`
        );
        if (node.type.name === "heading") {
          return placeholderTitle;
        } else if (node.type.name === "paragraph") {
          return placeholderStr;
        } else {
          return placeholderTitle;
        }
      },
    }),
    Image,
    Underline,
    TaskList,
    TaskItem.configure({
      nested: true,
    }),
    Slash.configure({
      suggestion: slashSuggestion,
    }),
    Progress,
    Star,
    Table.configure({
      resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
    Link,
    // Dot.configure({
    //   suggestion: dotSuggestion,
    // }),
    // Dot.configure({
    //   suggestion: slashSuggestion,
    // }),
    // BubbleMenu.configure({
    //   element: document.querySelector(".menu"),
    // }),
  ],
  // autofocus: true,
  editable: props.isEdit,
  onUpdate: ({ editor }) => {
    if (!updateState.value) {
      store.commit("common/setUpdateState", true);
    }
    if (editContent.value) {
      store.commit("message/updateEditContent", { detail: editor.getJSON() });
    }

  },
  onCreate: ({ editor }) => {
    if (props.initData) {
      editor.commands.setContent(props.initData.detail);
      editor.setEditable(props.isEdit);
      editor.commands.focus();
      countTaskNum(props.initData.detail);
      // store.commit("message/setEditor", editor);
    } else if (editContent.value) {
      editor.commands.setContent(editContent.value.detail);
      editor.setEditable(props.isEdit);
      editor.commands.focus();
      countTaskNum(editContent.value.detail);
    } else {
      editor.commands.clearContent();
      editor.commands.setContent({
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 2 },
          },
        ],
      });
      editor.commands.focus();
      store.commit("message/setEditor", editor);
    }
  },
  editorProps: {
    handleDOMEvents: {
      paste(view, event: ClipboardEvent) {
        if (event.clipboardData && event.clipboardData.files.length) {
          const text = event.clipboardData?.getData("text/plain");
          if (text) {
            console.log(text);
            return false;
          }
          event.preventDefault();
          const { schema } = view.state;
          const files = event.clipboardData.files;
          for (let index = 0; index < files.length; index++) {
            const file = files[index];
            if (file.type.includes("image/")) {
              let mimeType = ["image/png", "image/jpeg", "image/svg+xml"];
              uploadImage(file, uploadToken.value, mimeType, (url: string) => {
                const node = schema.nodes.image.create({
                  src: url,
                });
                const transaction = view.state.tr.replaceSelectionWith(node);
                view.dispatch(transaction);
              });
              // uploadImg(qiniuToken.value || "", file).then((url) => {
              //   const node = schema.nodes.image.create({
              //     src: url,
              //   });
              //   const transaction = view.state.tr.replaceSelectionWith(node);
              //   view.dispatch(transaction);
              // });
            } else {
              return false;
            }
          }
          return true;
        } else {
          return false;
        }
      },
    },
  },
});
const checked = ref<number>(0);
const total = ref<number>(0);
// watch(
//   () => props.initData,
//   (newData) => {
//     if (newData) {
//       editor.value?.commands.setContent(newData.detail);
//     }
//   },
//   { deep: true }
// );
watch(
  () => props.isEdit,
  (newVal) => {
    editor.value?.setEditable(newVal);
  }
);
// watch(editKey, (newVal) => {
//   console.log(editKey);
//   console.log(editContent.value);
//   if (newVal && editContent.value) {
//     editor.value?.commands.setContent(editContent.value);
//   }
// });
const handlePost = async (
  key: string,
  callback?: any,
  clear?: boolean,
  noMessage?: boolean,
  rePost?: boolean
) => {
  if (!editor.value) return;
  const json: JSONContent = editor.value.getJSON();
  let title: string | undefined = "New Topic";
  if (json.content) {
    if (
      json.content[0] &&
      json.content[0].content &&
      json.content[0].content[0]
    ) {
      title = json.content[0].content[0].text;
      if (!title) {
        // ElMessage.error("Please Enter Title");
        // return;
        json.content[0] = {
          attrs: { level: 2 },
          content: [{ type: "text", text: "New Topic" }],
          type: "heading",
        };
      } else {
        json.content[0] = {
          attrs: { level: 2 },
          content: [{ type: "text", text: title }],
          type: "heading",
        };
      }
    } else {
      json.content.unshift({
        attrs: { level: 2 },
        content: [{ type: "text", text: "New Topic" }],
        type: "heading",
      });
    }
    console.log(title);
    let arr = json.content;
    let cover = "";
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];
      if (item.type === "image") {
        cover = item.attrs?.src;
        break;
      }
    }
    const summary = editor.value
      .getText()
      .replace(title as string, "")
      .replace(/\r\n/g, "")
      .replace(/\n/g, "")
      .substring(0, 200);

    // if (props.initData) {
    //   // 有初始数据，更新数据
    //   store.dispatch("card/editCard", {
    //     cardKey: props.initData._key,
    //     title,
    //     content: json,
    //     summary,
    //   });
    // } else {
    // 创建数据
    // store.dispatch("card/addCard", { title, content: json, summary });
    countTaskNum(json.content);
    let obj: any = {
      title: title,
      detail: json.content,
      summary: summary,
      cover: cover,
      shake: props.shake,
    };
    if (rePost) {
      obj.forcePost = 1;
    }
    if (props.cardKey) {
      const postRes = (await api.request.patch("card", {
        cardKey: props.cardKey,
        ...obj,
      })) as ResultProps;
      if (postRes.msg === "OK") {
        if (!noMessage) {
          ElMessage({
            message: `Has Saved`,
            type: "success",
            duration: 1000,
          });
        }
        callback(postRes);
      }
    } else {
      const postRes = (await api.request.post("card", {
        receiverKey: key,
        ...obj,
      })) as ResultProps;
      if (postRes.msg === "OK") {
        if (!noMessage) {
          ElMessage({
            message: i18n.global.t(`tip["Send success"]`),
            type: "success",
            duration: 1000,
          });
        }
        callback(postRes);
      }
    }

    if (!clear) {
      editor.value.commands.clearContent();
      editor.value.commands.focus();
    }
    // }
  }
};
const toInfo = () => {
  router.push("/info/create");
  store.commit("message/setEditContent", editor.value?.getJSON().content);
};
const countTaskNum = (jsonContent: JSONContent) => {
  checked.value = 0;
  total.value = 0;
  if (!jsonContent) return;
  if (isArray(jsonContent)) {
    jsonContent.forEach((item, index) => {
      if (item.type === "taskList") {
        const taskList = item.content || [];
        taskList.forEach((taskItem) => {
          if (taskItem.type === "taskItem") {
            total.value++;
            if (taskItem.attrs?.checked) {
              checked.value++;
            }
          }
        });
      }
    });
  }
};
const insertNode = (type) => {
  switch (type) {
    case "bold":
      editor.value?.chain().toggleBold().focus().run();
      break;
    case "italic":
      editor.value?.chain().toggleItalic().focus().run();
      break;
    case "strike":
      editor.value?.chain().toggleStrike().focus().run();
      break;
    case "underline":
      editor.value?.chain().toggleUnderline().focus().run();
      break;
    case "text":
      editor.value?.chain().focus().run();
      break;
    case "h1":
      editor.value?.chain().setHeading({ level: 2 }).focus().run();
      break;
    case "h2":
      editor.value?.chain().setHeading({ level: 3 }).focus().run();
      break;
    case "progress":
      editor.value?.chain().setProgress().focus().run();
      break;
    case "star":
      editor.value?.chain().setStar().focus().run();
      break;
    case "text":
      editor.value?.chain().focus().run();
      break;
    case "h1":
      editor.value?.chain().setHeading({ level: 2 }).focus().run();
      break;
    case "h2":
      editor.value?.chain().setHeading({ level: 3 }).focus().run();
      break;
    case "h3":
      editor.value?.chain().setHeading({ level: 4 }).focus().run();
      break;
    case "divider":
      editor.value?.chain().setHorizontalRule().focus().run();
      break;
    case "bulletList":
      editor.value?.chain().toggleBulletList().focus().run();
      break;
    case "orderList":
      editor.value?.chain().toggleOrderedList().focus().run();
      break;
    case "taskList":
      editor.value?.chain().toggleTaskList().focus().run();
      break;
    case "blockquote":
      editor.value?.chain().setBlockquote().focus().run();
      break;
    case "code":
      editor.value?.chain().setCode().focus().run();
      break;
    case "codeBlock":
      editor.value?.chain().setCodeBlock().focus().run();
      break;
    case "link":
      const previousUrl = editor.value?.getAttributes("link").href;
      let url = window.prompt("URL", previousUrl);
      // cancelled
      if (url === null) {
        return;
      }
      // empty
      if (url === "") {
        editor.value?.chain().focus().extendMarkRange("link").unsetLink().run();
        return;
      }
      if (url.indexOf("http") === -1 || url.indexOf("https") === -1) {
        url = "https://" + url;
      }
      // update link
      editor.value
        ?.chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
      break;
  }
};
// 点击编辑器空白处
// const handleClickBlankSpace = () => {
//   if (editor.value && !props.readonly) {
//     // 末尾如果不是空行，则添加空行
//     const lastChild = editor.value.state.doc.lastChild;
//     // console.log("------", "handleClickBlankSpace");
//     if (lastChild && lastChild.content.size !== 0) {
//       editor.value
//         .chain()
//         // 光标定位到末尾
//         .focus("end")
//         // 插入空行
//         .insertContent({
//           type: "paragraph",
//         })
//         // 执行
//         .run();
//     } else if (
//       lastChild &&
//       (lastChild.type.name === "image" ||
//         lastChild.type.name === "progress" ||
//         lastChild.type.name === "star" ||
//         lastChild.type.name === "table")
//     ) {
//       // 光标定位到末尾
//       editor.value.commands.focus("end");
//       /// 当前光标位置
//       let currentPosition = editor.value.state.selection.anchor;
//       editor.value.commands.insertContentAt(currentPosition + 1, {
//         type: "paragraph",
//       });
//     } else {
//       editor.value.commands.focus("end");
//     }
//   }
// };
defineExpose({
  handlePost,
  toInfo,
});
</script>

<template>
  <bubble-menu
    :editor="editor"
    :tippy-options="{ duration: 100 }"
    v-if="editor"
    class="menu dp--center"
  >
    <div class="button dp--center" @click="insertNode('bold')">
      <icon-font name="bold" />
    </div>
    <div class="button dp--center" @click="insertNode('italic')">
      <icon-font name="italic" />
    </div>
    <div class="button dp--center" @click="insertNode('strike')">
      <icon-font name="strike" />
    </div>
    <div class="button dp--center" @click="insertNode('underline')">
      <icon-font name="underline" />
    </div>
    <div @click="insertNode('text')" class="button dp--center">
      <icon-font name="text" />
    </div>
    <div @click="insertNode('h1')" class="button dp--center">
      <icon-font name="h1" />
    </div>
    <div @click="insertNode('h2')" class="button dp--center">
      <icon-font name="h2" />
    </div>
    <div @click="insertNode('h3')" class="button dp--center">
      <icon-font name="h3" />
    </div>
    <div @click="insertNode('link')" class="button dp--center">
      <icon-font name="link" />
    </div>
    <div @click="insertNode('progress')" class="button dp--center">
      <icon-font name="progress" />
    </div>
    <div @click="insertNode('star')" class="button dp--center">
      <icon-font name="star" />
    </div>
    <div @click="insertNode('bulletList')" class="button dp--center">
      <icon-font name="bulletList" />
    </div>
    <div @click="insertNode('orderList')" class="button dp--center">
      <icon-font name="orderList" />
    </div>
    <div @click="insertNode('taskList')" class="button dp--center">
      <icon-font name="taskList" />
    </div>
    <div @click="insertNode('divider')" class="button dp--center">
      <icon-font name="divider" />
    </div>
    <div @click="insertNode('blockquote')" class="button dp--center">
      <icon-font name="blockquote" />
    </div>
    <div @click="insertNode('code')" class="button dp--center">
      <icon-font name="code" />
    </div>
    <div @click="insertNode('codeBlock')" class="button dp--center">
      <icon-font name="codeBlock" />
    </div>
  </bubble-menu>
  <!-- <floating-menu
    :editor="editor"
    :tippy-options="{ duration: 100 }"
    v-if="editor"
    class="menu dp--center"
  >
    <editor-item
      :editor="editor"
      :item-obj="{ width: '200px',overflow: 'auto' }"
      :itemHeight="30"
    />
  </floating-menu> -->
  <editor-content :editor="editor" />
  <div class="editor-nav" v-if="total > 0">
    {{ checked }} / {{ total }} 任务
  </div>
</template>

<style lang="scss">
/* Basic editor styles */
.ProseMirror {
  > * + * {
    margin-top: 0.75em;
  }
  ul,
  ol {
    padding: 0 1rem;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }
  mark {
    background-color: #faf594;
  }
  a {
    color: #68cef8;
    cursor: pointer;
  }
  table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    margin: 0;
    overflow: hidden;
    td,
    th {
      min-width: 1em;
      border: 2px solid #ced4da;
      padding: 3px 5px;
      vertical-align: top;
      box-sizing: border-box;
      position: relative;
      > * {
        margin-bottom: 0;
      }
    }
    th {
      font-weight: bold;
      text-align: left;
      background-color: var(--talk-hover-color);
    }
    .selectedCell:after {
      z-index: 2;
      position: absolute;
      content: "";
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: rgba(200, 200, 255, 0.4);
      pointer-events: none;
    }
    .column-resize-handle {
      position: absolute;
      right: -2px;
      top: 0;
      bottom: -2px;
      width: 4px;
      background-color: #adf;
      pointer-events: none;
    }
    p {
      margin: 0;
    }
  }
  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }
  .hljs-comment,
  .hljs-quote {
    color: #616161;
  }
  .hljs-variable,
  .hljs-template-variable,
  .hljs-attribute,
  .hljs-tag,
  .hljs-name,
  .hljs-regexp,
  .hljs-link,
  .hljs-name,
  .hljs-selector-id,
  .hljs-selector-class {
    color: #f98181;
  }
  .hljs-number,
  .hljs-meta,
  .hljs-built_in,
  .hljs-builtin-name,
  .hljs-literal,
  .hljs-type,
  .hljs-params {
    color: #fbbc88;
  }
  .hljs-string,
  .hljs-symbol,
  .hljs-bullet {
    color: #b9f18d;
  }
  .hljs-title,
  .hljs-section {
    color: #faf594;
  }
  .hljs-keyword,
  .hljs-selector-tag {
    color: #70cff8;
  }
  .hljs-emphasis {
    font-style: italic;
  }
  .hljs-strong {
    font-weight: 700;
  }
  pre {
    background: #0d0d0d;
    color: #fff;
    font-family: "JetBrainsMono", monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }
  }
  img {
    max-width: 100%;
    height: auto;
  }
  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0d0d0d, 0.1);
  }
  hr {
    border: none;
    border-top: 2px solid rgba(#0d0d0d, 0.1);
    margin: 2rem 0;
  }
}
/* Placeholder (at the top) */
.ProseMirror p.is-editor-empty:first-child::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
.tableWrapper {
  padding: 1rem 0;
  overflow-x: auto;
}
.resize-cursor {
  cursor: ew-resize;
  cursor: col-resize;
}
ul[data-type="taskList"] {
  list-style: none;
  padding: 0;
  p {
    margin: 0;
  }
  li {
    display: flex;
    > label {
      flex: 0 0 auto;
      margin-right: 0.5rem;
      user-select: none;
    }
    > div {
      flex: 1 1 auto;
    }
  }
}
/* Color swatches */
.color {
  white-space: nowrap;
  &::before {
    content: " ";
    display: inline-block;
    width: 1em;
    height: 1em;
    border: 1px solid rgba(128, 128, 128, 0.3);
    vertical-align: middle;
    margin-right: 0.1em;
    margin-bottom: 0.15em;
    border-radius: 2px;
    background-color: var(--color);
  }
}
/* 自加 */
:focus-visible {
  outline: none;
}
.ProseMirror-selectednode {
  outline: 3px solid #68cef8;
}
// 标题Placeholder
.ProseMirror h1.is-empty:first-child::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
.ProseMirror p.is-empty::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
.ProseMirror {
  padding: 0 15px;
  // 自定义checkbox样式
  ul[data-type="taskList"] > li {
    margin: 6px 0;
    line-height: 19px;
  }
  ul[data-type="taskList"] > li > label {
    input {
      display: none;
    }
    span {
      display: inline-block;
      width: 16px;
      height: 16px;
      border-radius: 16px;
      border: 1px solid var(--el-color-primary);
      position: relative;
      cursor: pointer;
      // margin-top: 5px;
    }
    span::before {
      display: inline-block;
      content: " ";
      width: 8px;
      border: 2px solid #fff;
      height: 4px;
      border-top: none;
      border-right: none;
      transform: rotate(-45deg);
      top: 4px;
      left: 3px;
      position: absolute;
      opacity: 0;
    }
    input:checked + span {
      background: var(--el-color-primary);
    }
    input:checked + span::before {
      opacity: 1;
      transform: all 0.5s;
    }
  }
  .el-progress-bar__inner {
    transition: unset;
  }
  .progress-container {
    padding: unset;
  }
  .mention-card {
    color: #64a1df;
    background-color: #ebf2fb;
    text-decoration: underline;
    cursor: pointer;
  }
  .mention-coop {
    color: #64a1df;
    background-color: #ebf2fb;
  }
}
/* Give a remote user a caret */
.collaboration-cursor__caret {
  position: relative;
  margin-left: -1px;
  margin-right: -1px;
  border-left: 1px solid #0d0d0d;
  border-right: 1px solid #0d0d0d;
  word-break: normal;
  pointer-events: none;
}
/* Render the username above the caret */
.collaboration-cursor__label {
  position: absolute;
  top: -1.4em;
  left: -1px;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  user-select: none;
  color: #0d0d0d;
  padding: 0.1rem 0.3rem;
  border-radius: 3px 3px 3px 0;
  white-space: nowrap;
}
.editor-nav {
  width: 100%;
  height: 30px;
  overflow-x: auto;
  overflow-y: hidden;
  text-align: right;
  font-size: 14px;
  color: var(--talk-font-color-2);
  margin-top: 35px;
}
.menu {
  background-color: var(--talk-bg-color);
  .button {
    margin-right: 5px;
    cursor: pointer;
    img {
      width: 15px;
      height: 15px;
      margin: 0px 8px;
      cursor: pointer;
    }
  }
}
.nav {
  position: absolute;
  top: 10px;
  right: 15px;
  z-index: 2;
}
</style>
