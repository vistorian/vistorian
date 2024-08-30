import { createUseStyles } from 'react-jss'
import React, {useState, useMemo, useEffect, useRef} from 'react'
import {Divider, Button, Tooltip, Row, Col, Input, message, Modal, Popconfirm} from 'antd'
import {FontSizeOutlined, FileImageOutlined, DeleteFilled, PlusCircleOutlined, QuestionCircleFilled} from '@ant-design/icons';
import { StoryContext } from './context'
import {NetworkConfig} from '../../../typings'
import {
    defaultDatasets,
    defaultNetworks,
    defaultColorScheme,
    defaultNodeTypeShapeScheme
} from '../../../typings/constant'
import { Editor } from '../../../typings'
import { Link, useParams } from 'react-router-dom'
import { Layout } from 'antd';
import EditorComp from "./editor/editor";
import {filter, update} from "lodash-es";

import NetVis from "./editor/netvis";
import VisModal from "./notebook/visModal";
import "@fontsource/poppins";
import PreviewStory from "./export/preview";
import { v4 as uuidv4 } from 'uuid';

const { Header } = Layout;
const { TextArea } = Input;



const INITIAL_DATA = {
    time: new Date().getTime(),
    blocks: [
        {
            type: "paragraph",
        },
    ],
};

const useStyles = createUseStyles({
    root: {
        display: "flex",
        justifyContent: "flex-start",
        height: '100%',
        width: '100%',
        color: '#333',
    },
    list: {
        width: 205,
        height: '100%',
        borderRight: '1px solid #d9d9d9',
        marginRight: 15,
        marginLeft:-25,
    },

    main: {
        width: "calc(100% - 230px)",
        maxHeight: '95vh',
        overflow: 'scroll',
        // background:'#E9E9EB',
    },
    header: {
        display: "flex",
        flexDirection: "column",
        alignContent:"center",
        alignItems:"center"
    },
    headerRight: {
        display: "flex",
        flexDirection: "column",
        alignContent:"center",
        alignItems:"center",
        paddingLeft:"10px",
        marginTop:"50px",
    },
    buttonLayout:{
        marginBottom: "10px",
        marginRight: "10px",
        paddingBottom: "50px",
        width: "115px",
        // background:"#F6A000"
    },
    tab: {
        padding: 10,
        height: 'calc((100% - 250px))',
        // height: '100%',
        overflow: 'scroll',
        alignItems:"center",
        // alignContent:"center",
    },
    tabHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: 'center',
        marginBottom: 5,
        lineHeight: "2.5em",
    },
    tabTitle: {
        fontSize: 18,
        fontWeight: 700,
    },
    tabContent: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        lineHeight: "2em",
    },
    tabFunc: {
        display: "flex",
    },
    titleText: {
        width: "calc(100% - 230px)",
        border: "none",
        resize: "none",
        fontSize: "2.1em",
        fontWeight: "bold",
        lineHeight: "1.2",
        outline: "none",
        paddingLeft:"20px",
        margin: "20px 20px 0px 40px",
        borderBottom: "1px solid #E17819",
        borderRadius:0
    },
    authorText: {
        width: "calc(100% - 230px)",
        border: "none",
        resize: "none",
        fontSize: "1em",
        fontStyle: "italic",
        lineHeight: "1.2",
        outline: "none",
        paddingLeft:"20px",
        margin: "20px 20px 20px 40px",
        borderBottom: "1px solid #E17819",
        borderRadius:0
    },
    cardsComp: {
        margin: "20px 20px 0px 20px",
        width: "calc(100% - 50px)",
        // display: 'flex',
        '&:hover $contentComp': {
            cursor: 'pointer',
            borderColor: 'transparent',
            boxShadow: '0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 3px 8px 2px rgba(0, 0, 0, 0.09)'
        },
        '&:hover $funcComp': {
            display: 'flex',
            // flexDirection: 'column',
            alignItems: 'right',
            justifyContent: 'right'
        }
    },
    contentComp: {
        background: '#fff',
        margin:20,
        border: '1px dashed grey',
    },
    funcComp: {
        display: 'none',
    },
    visBox: {
        border: '0.7px dashed gray',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // border: '2px dashed gray',
        minHeight: '250px',
    },
    caption:{
        textAlign: 'center',
        height:'30px',
        alignContent:'center'
    }
})


function Story() {
    const {storyId}= useParams();

    const classes = useStyles()

    /**
     * @description
     * @param {string[]} files: an array of file names
     */
    async function loadAndStoreFiles(files: string[]) {
        for (const filename of files) {
            const response = await fetch(`./data/${filename}`)
            const text = await response.text()
            window.localStorage.setItem(filename, text)
        }
    }


    useEffect(() => {
        let filesToStore = Array.from(defaultDatasets).map(d =>`UPLOADED_FILE_${d}`)
        // filesToStore.push(...Array.from(defaultDatasets).map(d => `UPLOADED_FILEINFO_${d}`))
        filesToStore.push(...Array.from(defaultNetworks).map(n =>`NETWORK_WIZARD_${n}`))
        // console.log('filesToStore', filesToStore)
        loadAndStoreFiles(filesToStore)
    }, []);

    const loadedFiles = Object.keys(window.localStorage)
        .filter(k => k.startsWith("UPLOADED_FILE_"))
        .map(n => n.slice(14))

    const loadedNetworks = Object.keys(window.localStorage)
        .filter(k => k.startsWith("NETWORK_WIZARD_"))
        .map(n => n.slice(15))

    const loadedSessions = Object.keys(window.localStorage)
        .filter(k => k.startsWith("SAVED_SESSION_"))
        .map((n) => {
            const sessionStr = window.localStorage.getItem(n)
            if (sessionStr) {
                return JSON.parse(sessionStr)
            }
            return null
        })

    const loadedEditor = Object.keys(window.localStorage)
        .filter(k => k.startsWith("EDITOR_COMPONENTS_"+storyId))
        .map((n) => {
            const editorStr = window.localStorage.getItem(n)
            if (editorStr) {
                return JSON.parse(editorStr)
            }
            return null
        })

    // handle the initialization based on the cache
    const [fileNameStore, setFileNameStore] = useState(loadedFiles)
    const [networkStore, setNetworkStore] = useState(loadedNetworks)
    const [sessionStore, setSessionStore] = useState(loadedSessions)
    const [editorStore, setEditorStore] = useState(loadedEditor)

    const storyContext = useMemo(
        () => ({ fileNameStore, setFileNameStore, networkStore, setNetworkStore, sessionStore, setSessionStore, editorStore, setEditorStore }),
        [fileNameStore, networkStore, sessionStore, editorStore]
    )

   // const { visTypes, network } = useParams()
    const visTypes = "nodelink"
    const network = "marieboucher"
    const visTypeList = visTypes?.split('+') as string[]

    const networkCfg = JSON.parse(window.localStorage.getItem("NETWORK_WIZARD_" + network) as string) as NetworkConfig

    const colorScheme = defaultColorScheme
    const nodeTypeShapeScheme = defaultNodeTypeShapeScheme
    const nodeTypeInShape: boolean = networkCfg.linkTableConfig?.linkType?.length as number > 0
    const nodeLabel = `"(datum.data && datum.data.${networkCfg.extraNodeConfig?.nodeLabel}) ? datum.data.${networkCfg.extraNodeConfig?.nodeLabel} : datum.id"`;
    // let nodeLabel: string = networkCfg.extraNodeConfig?.nodeLabel ? `"datum.data.${networkCfg.extraNodeConfig?.nodeLabel}"` : `"datum.id"`
    // let nodeLabel = `"datum.id"`;
    const timeFormat = networkCfg.linkTableConfig?.withTime ? `"${networkCfg.linkTableConfig.timeFormat}"` : null


    const options: any = {
        colorScheme: colorScheme,
        nodeTypeInShape: nodeTypeInShape,
        nodeTypeShapeScheme: nodeTypeShapeScheme,
        nodeLabel: nodeLabel,
        timeFormat: timeFormat,
    }



    const onAddComponent = (type: string) => {
        const maxId = editorStore.length +1;

        // eslint-disable-next-line prefer-const
        if (type == "text"){
            const newEditor = {
                id: maxId,
                type: type,
                textContent:{},
                created: new Date().toLocaleString('en-GB', {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric"
                })
            };
            window.localStorage.setItem("EDITOR_COMPONENTS_" + storyId+"_"+type+"_"+maxId, JSON.stringify(newEditor))
            setEditorStore([...editorStore, newEditor])

        } else if (type == "vis"){
            const newImgEditor = {
                id: maxId,
                type: type,
                created: new Date().toLocaleString('en-GB', {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric"
                }),
                isAddedVis:false,
                caption:"",
                networkEd:"",
                visTypeList:""
            };
            console.log("newImgEditor==="+JSON.stringify(newImgEditor));
            window.localStorage.setItem("EDITOR_COMPONENTS_" + storyId+"_"+type+"_"+maxId, JSON.stringify(newImgEditor))
            setEditorStore([...editorStore, newImgEditor])

        } else {
            const newEditorComp = {
                id: maxId,
                type: type,
                created: new Date().toLocaleString('en-GB', {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric"
                }),
                textId:maxId+"_text",
                textContent:{},
                visId:maxId+"_vis",
                networkEd: '',
                visTypeList: [],
                caption:"",
                isAddedVis:false,
            };

            window.localStorage.setItem("EDITOR_COMPONENTS_" + storyId+"_"+type+"_"+maxId, JSON.stringify(newEditorComp))
            setEditorStore([...editorStore, newEditorComp])
        }

        console.log("isinya components = "+ JSON.stringify(editorStore));

    };

    const toDeleteComponent = (editorId: string|number, type:string) => {
        window.localStorage.removeItem("EDITOR_COMPONENTS_" + storyId +"_"+type+"_"+editorId)
        const newStore = filter(editorStore, (ss) => ss.id !== editorId)
        setEditorStore(newStore);
        message.success('Component deleted!')
    }

    const [data, setData] = useState(INITIAL_DATA);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };




    const setContentTextById  = (data:object, editorId: number, editorType: string) => {


    };

    const addVisToEditor = (editorId: number, editorType: string, vis: string, network: string) => {
        handleCancel();

        const currentEd = window.localStorage.getItem("EDITOR_COMPONENTS_" + storyId + "_" + editorType + "_" + editorId)
        console.log("CURRENT "+JSON.stringify(currentEd));
        let currentEds = JSON.parse(currentEd);
        window.localStorage.removeItem("EDITOR_COMPONENTS_" + storyId + "_" + editorType + "_" + editorId)
        setEditorStore([editorStore])

        const visTypeListComp = vis?.split('+') as string[]
        let newImgEditorComp={};
        if (editorType=="vis"){
             newImgEditorComp = {
                id: editorId,
                type: editorType,
                created:currentEds.created,
                isAddedVis:true,
                visId:editorId+"_vis",
                networkEd: network,
                visTypeList: visTypeListComp,
                caption:"",
            };
        } else{
             newImgEditorComp = {
                id: editorId,
                type: editorType,
                created:currentEds.created,
                isAddedVis:true,
                textId:editorId+"_text",
                textContent:currentEds.textContent,
                visId:editorId+"_vis",
                networkEd: network,
                visTypeList: visTypeListComp,
                caption:"",
            };
        }

        window.location.reload();
        window.localStorage.removeItem("EDITOR_COMPONENTS_" + storyId + "_" + editorType + "_" + editorId)
        window.localStorage.setItem("EDITOR_COMPONENTS_" + storyId+"_"+editorType+"_"+editorId, JSON.stringify(newImgEditorComp))
        setEditorStore([...editorStore, newImgEditorComp])


    }

    const sortEd = (a: Editor, b: Editor) => {
        return Date.parse(b.created) - Date.parse(a.created)
    }

    const getTitle = window.localStorage.getItem("title")=="" || null ? "" : window.localStorage.getItem("title");
    const getAuthor = window.localStorage.getItem("author")=="" || null ? "" : window.localStorage.getItem("author");

    const [title, setTitle] = useState(getTitle)
    const [author, setAuthor] = useState(getAuthor)
    const [publish, setPublished] = useState(false)


    const handleTitleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
        window.localStorage.setItem("title", event.target.value)
    }
    const handleAuthorOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAuthor(event.target.value);
        window.localStorage.setItem("author", event.target.value)
    }

    const handleBlur = (editorId, editorType, e: React.FocusEvent<HTMLInputElement>) => {
            const currentEd = window.localStorage.getItem("EDITOR_COMPONENTS_" + storyId + "_" + editorType + "_" + editorId)
            console.log("CURRENT "+JSON.stringify(currentEd));
            let currentEds = JSON.parse(currentEd);

            window.localStorage.removeItem("EDITOR_COMPONENTS_" + storyId + "_" + editorType + "_" + editorId)

            const updateEditor = {
                ...currentEds,
                caption: e.target.value,
            };

            window.localStorage.setItem("EDITOR_COMPONENTS_" + storyId+"_"+editorType+"_"+editorId, JSON.stringify(updateEditor))
            const currentEdNew = window.localStorage.getItem("EDITOR_COMPONENTS_" + storyId + "_" + editorType + "_" + editorId)
            //console.log("CURRENT NOW "+JSON.stringify(currentEdNew));

            setEditorStore([...editorStore, updateEditor])
    }


    const toExportStory = () => {
        // constructJSON Data
        const story={
            storyID:storyId,
            title:window.localStorage.getItem("title"),
            author:window.localStorage.getItem("author"),
            published:true,
            created: new Date().toLocaleString('en-GB', {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric"
            }),
            editorStore
        };

        console.log("CURRENT STORY "+JSON.stringify(story));
        window.localStorage.setItem("STORY_"+storyId, JSON.stringify(story))


    }

    const [openConfirm, setOpenConfirm] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);


    const showModalConfirm = () => {
        toExportStory();
        setIsModalConfirmOpen(true);
    };

    const onOkModalConfirm = () => {
        setIsModalConfirmOpen(false);
        message.success('Story Published')
        window.location.reload();

    };

    const handleCancelConfirm = () => {
        setIsModalConfirmOpen(false);
    };


    return (
        <StoryContext.Provider value={storyContext}>

            <div className={classes.root}>

                <div className={classes.list}>
                    <div className={classes.header}>
                        <a href="./" style={{marginBottom: "20px", textAlign: 'center', marginTop: 15}}>
                            <img src="./logos/logo-a.png" style={{width: 180}}/>
                        </a>

                        <Divider style={{margin: '0px 0px'}}/>
                            <h4> Add Layout </h4>
                        <Divider style={{margin: '0px 0px'}}/>

                        <div className={classes.tab} style={{margin: "20px"}}>

                            <div className={classes.headerRight}>

                                <Tooltip title="Add Text to editor">
                                    <Button  type="primary" icon={<FontSizeOutlined/>} className={classes.buttonLayout}
                                            onClick={() => onAddComponent("text")}
                                    >
                                        <br/> Text </Button>
                                </Tooltip>

                                <Tooltip title="Add Visualization">
                                    <Button type="primary" icon={<FileImageOutlined/>}
                                            className={classes.buttonLayout}
                                            onClick={() => onAddComponent("vis")}
                                    >
                                        <br/> Visualization </Button>
                                </Tooltip>

                                <Tooltip title="Add Text and Visualization side to side">
                                    <Button type="primary" icon={<FontSizeOutlined/>}
                                            className={classes.buttonLayout}
                                            onClick={() => onAddComponent("textvis")}
                                    >
                                        <FileImageOutlined/>
                                        <br/> Text & Vis </Button>
                                </Tooltip>

                            </div>

                        </div>
                    </div>

                </div>


                <div className={classes.main}>

                    <div className="editor" style={{paddingTop: "20px", paddingLeft: "30px"}}>

                        <Input className={classes.titleText} id={'textTitle'} placeholder="Title.." onChange={handleTitleOnChange} value={title}>
                        </Input>

                        <Input className={classes.authorText} id={'textAuthor'} placeholder="Author.." onChange={handleAuthorOnChange} value={author}>
                        </Input>

                        <div id="mainContainerBlog" key={storyId}>

                            {editorStore.sort(sortEd).map((editor: Editor) => (

                                <div className="item" id={`id${editor.id}`} key={`key${editor.id}`}>

                                    {
                                        editor.type=="text" ? (
                                                        <div className={classes.cardsComp} id={`idText${editor.id}`}>
                                                            <div className={classes.contentComp}>
                                                                <EditorComp
                                                                    data={editor.textContent}
                                                                    onChange={setContentTextById}
                                                                    editorId={editor.id}
                                                                    storyId={storyId}
                                                                    editorType={editor.type}
                                                                    editorblock={"editorjs" + storyId + "ed" + editor.id}/>
                                                            </div>
                                                            <div className={classes.funcComp}>
                                                                <Button
                                                                    icon={<DeleteFilled />}
                                                                    type='text'
                                                                    shape='circle'
                                                                    onClick={() => toDeleteComponent(editor.id, editor.type)}
                                                                />
                                                            </div>

                                                        </div>
                                                    ) :  editor.type=="vis"  ? (
                                                        <div className={classes.cardsComp} id={editor.id}>
                                                            <div className={classes.contentComp}
                                                                 style={{minHeight: '250px'}}>
                                                                {
                                                                editor.isAddedVis ? (

                                                                <div style={{padding: "20px"}}>

                                                                    <NetVis key={`vis${editor.id}`}
                                                                            storyId={storyId}
                                                                            editorId={editor.id}
                                                                            uniqueId={uuidv4()}
                                                                            visTypeList={editor.visTypeList}
                                                                            network={editor.networkEd as string}
                                                                            options={options}/>
                                                                </div>

                                                                ) : (
                                                                <div className={classes.visBox}
                                                                     onClick={showModal}>
                                                                    <PlusCircleOutlined/> Select Visualization
                                                                </div>
                                                                )
                                                                }

                                                                <Modal title="Select visualization" name={editor.id} open={isModalOpen} onCancel={handleCancel} footer={null} width={700}>
                                                                        <VisModal key={editor.id}
                                                                                  storyId={storyId}
                                                                                  editorId={editor.id}
                                                                                  editorType={editor.type}
                                                                                  addVisToEditor={addVisToEditor}/>

                                                                </Modal>

                                                                    <div>
                                                                        <Input style={{textAlign: 'center'}}
                                                                               onBlur={(e) => handleBlur(editor.id, editor.type, e)}
                                                                               placeholder="write caption.."/>
                                                                    </div>



                                                            </div>
                                                            <div className={classes.funcComp}>
                                                                <Button
                                                                    icon={<DeleteFilled/>}
                                                                type='text'
                                                                shape='circle'
                                                                onClick={() => toDeleteComponent(editor.id, editor.type)}
                                                                />
                                                            </div>

                                                    </div>
                                                    ) : (

                                                            <div className={classes.cardsComp} id={editor.id}>
                                                                <div className={classes.contentComp}>

                                                                    <Row>
                                                                        <Col span={10} style={{border:"0.7px dashed grey"}}>
                                                                            <EditorComp
                                                                                data={editor.textContent}
                                                                                onChange={setContentTextById}
                                                                                editorId={editor.id}
                                                                                storyId={storyId}
                                                                                editorType={editor.type}
                                                                                editorblock={"editorjs" + storyId + "ed" + editor.id}/>
                                                                        </Col>
                                                                        <Col span={14} style={{minHeight: "300px"}}>

                                                                            {
                                                                                editor.isAddedVis ? (

                                                                                    <div style={{padding: "20px"}}>

                                                                                        <NetVis key={editor.id}
                                                                                                uniqueId={uuidv4()}
                                                                                                visTypeList={editor.visTypeList}
                                                                                                network={editor.networkEd as string}
                                                                                                options={options}/>
                                                                                    </div>

                                                                                ) : (
                                                                                    <div className={classes.visBox}
                                                                                         onClick={showModal}>
                                                                                        <PlusCircleOutlined/> Select
                                                                                        Visualization
                                                                                    </div>
                                                                                )
                                                                            }

                                                                            <Modal title="Select visualization"
                                                                                   name={editor.id} open={isModalOpen}
                                                                                   onCancel={handleCancel} footer={null}
                                                                                   width={700}>
                                                                                <VisModal key={editor.id}
                                                                                          storyId={storyId}
                                                                                          editorId={editor.id}
                                                                                          editorType={editor.type}
                                                                                          addVisToEditor={addVisToEditor}/>

                                                                            </Modal>


                                                                            {/*<div contentEditable={true} id={editor.id}*/}
                                                                            {/*     style={{textAlign: 'center'}}*/}
                                                                            {/*     placeholder="write caption..">*/}
                                                                            {/*</div>*/}
                                                                            <div>
                                                                                <Input style={{textAlign: 'center'}}
                                                                                       onBlur={(e) => handleBlur(editor.id, editor.type, e)}
                                                                                       placeholder="write caption.."/>
                                                                            </div>


                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                                <div className={classes.funcComp}>
                                                                    <Button
                                                                        icon={<DeleteFilled/>}
                                                                        type='text'
                                                                        shape='circle'
                                                                        onClick={() => toDeleteComponent(editor.id, editor.type)}
                                                                    />
                                                                </div>
                                                            </div>

                                                    )
                                                }

                                            </div>


                                        ))}
                        </div>

                    </div>

                    <Row>
                        <Col span={23} style={{textAlign: "right", marginTop:50}}>
                            {/*<Popconfirm*/}
                            {/*    title="Export Story?"*/}
                            {/*    // description="Export your story?"*/}
                            {/*    open={openConfirm}*/}
                            {/*    onConfirm={handleOkConfirm}*/}
                            {/*    okButtonProps={{ loading: confirmLoading }}*/}
                            {/*    onCancel={handleCancelConfirm}*/}
                            {/*>*/}
                                <Button
                                    type="primary"
                                    onClick={showModalConfirm}
                                >
                                    Preview
                                </Button>
                            {/*</Popconfirm>*/}
                            </Col>
                    </Row>

                    <Modal
                        title="Preview"
                        open={isModalConfirmOpen}
                        onOk={onOkModalConfirm}
                        width={1000}
                        onCancel={handleCancelConfirm}
                        okText="Publish"
                    >
                       <PreviewStory storyId={storyId}/>
                    </Modal>

                </div>

            </div>

        </StoryContext.Provider>
    )
}


export default Story