import React from "react";
import { observer } from "mobx-react-lite";
import SunEditor from "suneditor-react";
import { font, fontSize, fontColor, hiliteColor, list, align, image, link } from "suneditor/src/plugins";
import "suneditor/dist/css/suneditor.min.css";
import { useRootStore } from "../../mobx/bridge";
import templateWord from "./AddTemplateWordPlugin";
import "./Editor.module.css";
import { safeInsertNodeInEditor } from "../../helpers/utils/utils";
import uploadImage from "../../helpers/uploadImage";
import parseTextToHtml from "../../helpers/plainTextToHtmlParser";

const Editor = observer(() => {
  const { commonStore, uiStateStore } = useRootStore();

  const isCodeViewAllowed = commonStore.clientsWithAllowedCodeView.includes(parseInt(commonStore.cpClientId, 10));

  const editorRef = React.useRef(null);

  const getStickyToolbarPosition = () => (uiStateStore.cpHeaderHeight ? `${uiStateStore.cpHeaderHeight}px` : 0);

  const updateEditorToolbar = () => {
    if (editorRef?.current?.setOptions && typeof editorRef?.current?.setOptions === "function") {
      editorRef.current.setOptions?.({
        stickyToolbar: getStickyToolbarPosition(),
      });
    }
  };

  React.useEffect(() => {
    window.addEventListener("resize", () => updateEditorToolbar());

    return () => {
      window.removeEventListener("resize", () => updateEditorToolbar());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    // focus on editor to prevent image drag & drop from overriding all content
    if (uiStateStore.shouldFocusEditor) {
      // retain position because of Chrome
      const x = window?.scrollX;
      const y = window?.scrollY;
      editorRef.current?.core?.focus({ preventScroll: true });
      window?.scroll(x, y);

      uiStateStore.setShouldFocusEditor(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uiStateStore.shouldFocusEditor]);

  React.useEffect(() => {
    if (commonStore.textReplaced) {
      editorRef.current.setContents(commonStore.emailTemplateEditorText);
      commonStore.setTextReplaced(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commonStore.emailTemplateEditorText]);

  const getSunEditorInstance = (sunEditor) => {
    if (sunEditor) {
      editorRef.current = sunEditor;
      commonStore.setEmailTemplateEditorText(editorRef.current.getContents());
    }
  };

  const setEditorText = (content) => {
    commonStore.setEmailTemplateEditorText(content);
  };

  const dropImg = (e) => {
    const transferData = e.dataTransfer.getData("text/html");

    if (transferData.includes('alt="Image"')) {
      const node = editorRef.current.core.util.createElement("div");
      node.innerHTML = transferData;

      safeInsertNodeInEditor(editorRef.current.core, node);
    } else if (transferData.includes('data-special=""') || transferData.includes('data-default-btn-template=""')) {
      const node = editorRef.current.core.util.createElement("span");
      node.innerHTML = `${transferData}<div><br /></div>`;

      safeInsertNodeInEditor(editorRef.current.core, node);
    }

    return false;
  };

  const onPaste = (e) => {
    const content = parseTextToHtml(e.clipboardData.getData("Text"));
    const node = editorRef.current.core.util.createElement("span");

    node.innerHTML = content;

    safeInsertNodeInEditor(editorRef.current.core, node);
  };

  React.useEffect(() => {
    if (commonStore.templateKeywordData) {
      let contentToSet = commonStore.emailTemplateEditorText && commonStore.emailTemplateEditorText !== "<p><br></p>" ? commonStore.emailTemplateEditorText : commonStore.getDefaultTemplate;

      contentToSet = commonStore.setApplyAllReplacements(contentToSet);

      // set logo in the editor
      contentToSet = commonStore.setAddClientLogoInEditor(contentToSet);

      editorRef?.current?.setContents(contentToSet);

      // set content again to center the image using the tags SunEditor generates
      editorRef?.current?.setContents(commonStore.setUpdateLogoForEditor(editorRef.current.getContents()));

      // set content again...to remove extra <br> generated
      editorRef?.current?.setContents(commonStore.setRemoveBrTagFromLogoForEditor(editorRef.current.getContents()));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commonStore.templateKeywordData]);

  const updateEmailTemplateEditorText = () => {
    commonStore.setEmailTemplateEditorText(editorRef.current.getContents());
  };

  const handleImageUploadBefore = (files, info, uploadHandler) => {
    uploadImage(files?.[0], updateEmailTemplateEditorText, uploadHandler);
  };

  return (
    <SunEditor
      onImageUploadBefore={handleImageUploadBefore}
      getSunEditorInstance={getSunEditorInstance}
      showToolbar
      height="auto"
      defaultValue={commonStore.getDefaultTemplate}
      setOptions={{
        stickyToolbar: getStickyToolbarPosition(),
        plugins: [font, fontSize, fontColor, hiliteColor, list, align, image, templateWord, link],
        buttonList: [
          ["font"],
          ["fontSize"],
          ["fontColor"],
          ["bold", "underline", "italic", "hiliteColor"],
          ["list"],
          ["align"],
          [templateWord.name],
          ["link"],
          ["undo"],
          ["redo"],
          isCodeViewAllowed ? ["codeView"] : "",
        ],
        attributesWhitelist: { all: "style|data-.+" },
        showPathLabel: false,
        icons: {
          link: `<div class="sunEditorHyperlinkImage" data-testid="hyperlink"/>`,
          undo: `<div class="sunEditorUndoImage"/>`,
          redo: `<div class="sunEditorRedoImage"/>`,
        },
        imageWidth: "100%",
        imageUrlInput: false,
      }}
      onChange={setEditorText}
      onDrop={dropImg}
      onPaste={onPaste}
    />
  );
});

export default Editor;
