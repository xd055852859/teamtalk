<script setup lang="ts">
import {
  EditorContent,
  JSONContent,
  useEditor,
  FloatingMenu,
} from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import IconFont from "@/components/iconFont.vue";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Progress from "@/components/editor/progress";
import i18n from "@/language/i18n";
import { Card } from "@/interface/Message";
import { ElMessage } from "element-plus";
import { useStore } from "@/store";
import EditorNav from "./editorNav.vue";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";

import Slash from "./slash/slashs";
import slashSuggestion from "./slash/suggestion";
import { BubbleMenu } from "./bubble-menu/BubbleMenu";
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
const editor = useEditor({
  content: {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 2 },
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
          return placeholderStr;
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
    Progress
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
      console.log(editor.getJSON());
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
      store.commit("message/setEditor", editor);
    }
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
  noMessage?: boolean
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
    let obj = {
      title: title,
      detail: json.content,
      summary: summary,
      cover: cover,
      shake: props.shake,
    };
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
            message: "Post Success",
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
};
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
    <div
      class="button dp--center"
      @click="editor?.chain().focus().toggleBold().run()"
    >
      <icon-font name="bold" />
    </div>
    <div
      class="button dp--center"
      @click="editor?.chain().focus().toggleItalic().run()"
    >
      <icon-font name="italic" />
    </div>
    <div
      class="button dp--center"
      @click="editor?.chain().focus().toggleStrike().run()"
    >
      <icon-font name="strike" />
    </div>
    <div
      class="button dp--center"
      @click="editor?.chain().focus().toggleUnderline().run()"
    >
      <icon-font name="underline" />
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
  outline: none;
  &:focus {
    outline: none;
  }
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

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
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
    max-width: 80%;
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
}

/* Placeholder (at the top) */
.ProseMirror p.is-editor-empty:first-child::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
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

/* 自加 */
:focus-visible {
  outline: none;
}
.ProseMirror-selectednode {
  outline: 3px solid #68cef8;
}
// 标题Placeholder
.ProseMirror h1.is-empty:first-child::before,
.ProseMirror h2.is-empty:first-child::before,
.ProseMirror h3.is-empty:first-child::before,
.ProseMirror h4.is-empty:first-child::before,
.ProseMirror h5.is-empty:first-child::before,
.ProseMirror h6.is-empty:first-child::before {
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
.ProseMirror input[type="checkbox"] {
  border-radius: 50%;
}
.editor-nav {
  width: 100%;
  height: 30px;
  overflow-x: auto;
  overflow-y: hidden;
  text-align: right;
  font-size: 14px;
  color: var(--talk-font-color-2);
}
.menu {
  background-color: var(--talk-bg-color);
  .button {
    margin-right: 5px;
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
