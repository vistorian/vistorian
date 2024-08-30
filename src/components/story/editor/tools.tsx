import Paragraph from "@editorjs/paragraph";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Delimiter from "@editorjs/delimiter";
import CheckList from "@editorjs/checklist";
import SimpleImage from "@editorjs/simple-image";
import Marker from "@editorjs/marker";
import Table from "@editorjs/table";
import InlineCode from "@editorjs/inline-code";
import AlignmentTuneTool from "editorjs-text-alignment-blocktune";

export const EDITOR_JS_TOOLS = {
    paragraph: {
        class: Paragraph,
        inlineToolbar:['bold', 'italic', 'link', 'marker'],
        config: {
            placeholder: 'Write something..'
        },
        tunes: ["anyTuneName"],
    },
    checkList:
        {
            class: CheckList,
            inlineToolbar: ['bold', 'italic', 'link', 'marker']
        },
    list: {
        class: List,
        inlineToolbar: ['bold', 'italic', 'link', 'marker']
    },
    delimiter: Delimiter,
    header: {
        class: Header,
        inlineToolbar: ['link', 'marker'],
        config: {
            placeholder: 'Header'
        },
        tunes: ["anyTuneName"],
    },
    image: {
        class: SimpleImage,
        inlineToolbar: true,
    },
    // quote: {
    //     class: Quote,
    //     inlineToolbar: true,
    //     config: {
    //         quotePlaceholder: 'Enter a quote',
    //         captionPlaceholder: 'Quote\'s author',
    //     },
    //     shortcut: 'CMD+SHIFT+O'
    // },
    // warning: Warning,
    marker: {
        class:  Marker,
        shortcut: 'CMD+SHIFT+M'
    },
    inlineCode: {
        class: InlineCode,
        shortcut: 'CMD+SHIFT+C'
    },
    table: {
        class: Table,
        inlineToolbar: true,
        shortcut: 'CMD+ALT+T'
    },
    anyTuneName: {
        class: AlignmentTuneTool,
        config: {
            default: "left",
            blocks: {
                header: "left",
                paragraph: "left"
            }
        }
    },
};