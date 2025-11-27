import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { ko } from "@blocknote/core/locales";
import type { Block } from "@blocknote/core";
import { useEffect } from "react";

interface Props {
  props: Block[];
  onSetContent?: (params: Block[]) => void;
  readonly?: boolean;
}

function AppTextEditor({ props, readonly, onSetContent }: Props) {
  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    dictionary: ko,
  });

  useEffect(() => {
    if (props && props.length > 0) {
      editor.replaceBlocks(editor.document, props);
    }
  }, []);

  // Renders the editor instance using a React component.
  return (
    <BlockNoteView
      editor={editor}
      editable={!readonly}
      onChange={() => {
        if (!readonly) {
          // !readonly => 생성 페이지에서 접근
          onSetContent?.(editor.document);
        }
      }}
    />
  );
}

export { AppTextEditor };
