// import React, { useEffect, useRef } from 'react';
// import EditorJS from '@editorjs/editorjs';
// import Header from '@editorjs/header';
// import List from '@editorjs/list';
//
// const Editor: React.FC = () => {
//     const editorRef = useRef<EditorJS | null>(null);
//     const editorHolderRef = useRef<HTMLDivElement | null>(null);
//
//     useEffect(() => {
//         if (editorHolderRef.current) {
//             editorRef.current = new EditorJS({
//                 holder: editorHolderRef.current,
//                 tools: {
//                     header: Header,
//                     list: List,
//                 },
//                 autofocus: true,
//             });
//         }
//
//         return () => {
//             if (editorRef.current) {
//                 editorRef.current.destroy();
//                 editorRef.current = null;
//             }
//         };
//     }, []);
//
//     return (
//         <div style={{ border: '1px solid #ccc', padding: '10px' }}>
//             <div ref={editorHolderRef}></div>
//         </div>
//     );
// };
//
// export default Editor;