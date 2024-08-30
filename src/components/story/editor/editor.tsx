import React, {memo, useEffect, useRef} from "react";
import EditorJS from "@editorjs/editorjs";
import {EDITOR_JS_TOOLS} from "./tools";


const EditorComp = ({data, onChange, editorblock, editorId, editorType, storyId}) => {
    const ref = useRef();

    useEffect(() => {
        //Initialize editorjs if we don't have a reference
        if (!ref.current) {
            const editor = new EditorJS({
                holder: editorblock,
                // placeholder: 'Let`s write an awesome story!',
                inlineToolbar: ['marker'],
                tools: EDITOR_JS_TOOLS,
                autofocus: true,
                data: data,
                async onChange(api, event) {
                    const data = await api.saver.save();
                    const currentEd = window.localStorage.getItem("EDITOR_COMPONENTS_" + storyId + "_" + editorType + "_" + editorId)
                    console.log("CURRENT "+JSON.stringify(currentEd));
                    let currentEds = JSON.parse(currentEd);

                    if (editorType == "text"){
                        const newEditor = {
                            id: editorId,
                            type: editorType,
                            textContent:data,
                            created: currentEds.created
                        };
                        window.localStorage.setItem("EDITOR_COMPONENTS_" + storyId+"_"+editorType+"_"+editorId, JSON.stringify(newEditor))
                        //setEditorStore([...editorStore, newEditor])

                    } else {
                        const newEditorComp = {
                            id: editorId,
                            type: editorType,
                            created: currentEds.created,
                            textId:editorId+"_text",
                            textContent:data,
                            visId:currentEds.visId,
                            networkEd: currentEds.networkEd,
                            visTypeList: currentEds.visTypeList,
                            caption:currentEds.caption,
                            isAddedVis:currentEds.isAddedVis,
                        };

                        window.localStorage.setItem("EDITOR_COMPONENTS_" + storyId+"_"+editorType+"_"+editorId, JSON.stringify(newEditorComp))
                        //setEditorStore([...editorStore, newEditorComp])
                    }
                    const currentEd2 = window.localStorage.getItem("EDITOR_COMPONENTS_" + storyId + "_" + editorType + "_" + editorId)
                    console.log(JSON.stringify(currentEd2));

                    onChange(data);
                },
            });
            ref.current = editor;
        }

        //Add a return function to handle cleanup
        return () => {
            if (ref.current && ref.current.destroy) {
                ref.current.destroy();
            }
        };
    }, []);
    return <div id={editorblock}/>;
};

export default memo(EditorComp);