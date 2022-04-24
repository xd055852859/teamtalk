<script setup lang="ts">
import {
  EditorContent,
  JSONContent,
  useEditor,
  BubbleMenu,
  FloatingMenu,
} from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import i18n from "@/language/i18n";
import { Card } from "@/interface/Message";
import { ElMessage } from "element-plus";
import { useStore } from "@/store";
import EditorNav from "./editorNav.vue";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";

import Slash from "./slash/slashs";
import slashSuggestion from "./slash/suggestion";
// import suggestion1 from "./suggestion1";
import boldSvg from "@/assets/editor/bold.svg";
import italicSvg from "@/assets/editor/italic.svg";
import strikeSvg from "@/assets/editor/strike.svg";
import underlineSvg from "@/assets/editor/underline.svg";
import boldwSvg from "@/assets/editor/boldw.svg";
import italicwSvg from "@/assets/editor/italicw.svg";
import strikewSvg from "@/assets/editor/strikew.svg";
import underlinewSvg from "@/assets/editor/underlinew.svg";
import EditorItem from "./editorItem.vue";
const router = useRouter();
const props = defineProps<{
  initData?: Card | null;
  isEdit: boolean;
  cardKey?: string;
  shake: boolean;
}>();
const emits = defineEmits(["changeUpdate"]);
const store = useStore();
const dark = computed(() => store.state.common.dark);
const editKey = computed(() => store.state.message.editKey);
const editContent = computed(() => store.state.message.editContent);
const editor = useEditor({
  content: {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
      },
    ],
  },
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: ({ node }) => {
        const placeholderStr = i18n.global.t("tip.text");
        const placeholderTitle = i18n.global.t("tip.title");
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
  onUpdate: () => {
    emits("changeUpdate", true);
  },
  onCreate: ({ editor }) => {
    if (props.initData) {
      console.log(props.initData);
      editor.commands.setContent(props.initData.detail);
      editor.setEditable(props.isEdit);
      editor.commands.focus();
    }
  },
});
store.commit("message/setEditor", editor);
watch(
  () => props.initData,
  (newData) => {
    if (newData) {
      editor.value?.commands.setContent(newData.detail);
    }
  },
  { deep: true }
);
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
async function handlePost(
  key: string,
  callback?: any,
  clear?: boolean,
  noMessage?: boolean
) {
  if (!editor.value) return;
  const json: JSONContent = editor.value.getJSON();
  console.log(json);
  if (
    json.content &&
    json.content[0] &&
    json.content[0].content &&
    json.content[0].content[0]
  ) {
    let title = json.content[0].content[0].text;
    if (!title) {
      ElMessage.error("Please Enter Title");
      return;
    }
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
      .replace(title, "")
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
          ElMessage.success("UpDate success");
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
          ElMessage.success("Post Success");
        }
        callback(postRes);
      }
    }

    if (!clear) {
      editor.value.commands.clearContent();
      editor.value.commands.focus();
    }
    // }
  } else {
    ElMessage.error("Please Enter Title");
    return;
  }
}
const toInfo = () => {
  router.push("/info/create");
  store.commit("message/setEditContent", editor.value?.getJSON().content);
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
      :class="{ 'is-active': editor.isActive('bold') }"
      @click="editor?.chain().focus().toggleBold().run()"
    >
      <img :src="dark ? boldwSvg : boldSvg" alt="" />
    </div>
    <div
      class="button dp--center"
      :class="{ 'is-active': editor.isActive('bold') }"
      @click="editor?.chain().focus().toggleItalic().run()"
    >
      <img :src="dark ? italicwSvg : italicSvg" alt="" />
    </div>
    <div
      class="button dp--center"
      :class="{ 'is-active': editor.isActive('bold') }"
      @click="editor?.chain().focus().toggleStrike().run()"
    >
      <img :src="dark ? strikewSvg : strikeSvg" alt="" />
    </div>
    <div
      class="button dp--center"
      :class="{ 'is-active': editor.isActive('bold') }"
      @click="editor?.chain().focus().toggleUnderline().run()"
    >
      <img :src="dark ? underlinewSvg : underlineSvg" alt="" />
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
  <!-- <div v-if="position === 'bottom' && editor" class="editor-nav dp--center">
    <editor-nav :editor="editor" />
  </div> -->
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
  height: 30px;
  overflow-x: auto;
  overflow-y: hidden;
  position: absolute;
  left: 0px;
  bottom: 0px;
  &::-webkit-scrollbar {
    height: 0px;
  }
}
.menu {
  img {
    width: 15px;
    height: 15px;
    margin: 0px 8px;
    cursor: pointer;
  }
}
.nav {
  position: absolute;
  top: 10px;
  right: 15px;
  z-index: 2;
}
</style>
