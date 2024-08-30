import { createUseStyles } from 'react-jss'
import React, {useState, useMemo, useEffect} from 'react'
import {Divider, Button, Tooltip, Row, Col, Input} from 'antd'
import EditorTextParser from './EditorTextParser'
import { StoryContext } from './../context'
import {NetworkConfig} from '../../../../typings'
import {
    defaultDatasets,
    defaultNetworks,
    defaultColorScheme,
    defaultNodeTypeShapeScheme
} from '../../../../typings/constant'
import { Editor } from '../../../../typings'
import {  useParams } from 'react-router-dom'
import { Layout } from 'antd';


import NetVis from "./../editor/netvis";
import "@fontsource/poppins";

const { Header } = Layout;
const { TextArea } = Input;


const useStyles = createUseStyles({
    root: {
        // display: "flex",
        justifyContent: "left",
        height: '100%',
        width: '100%',
        color: '#333',
        // fontFamily:'Poppins'
    },
    main: {
        width: "80%",
        maxHeight: '95vh',
        overflow: 'scroll',
        // fontFamily:'Poppins',
        paddingLeft:'10%',
        paddingRight:'10%'
        // background:'#E9E9EB',
    },
    header: {
        width: "calc(100% - 50px)",
        display: "flex",
        flexDirection: "column",
        alignContent:"center",
        alignItems:"center",
        justifyContent:'center'
    },
    titleText: {
        width: "calc(100% - 100px)",
        // border: "none",
        // resize: "none",
        fontSize: "2.1em",
        fontWeight: "bold",
        // lineHeight: "1.2",
        // outline: "none",
        // paddingLeft:"20px",
        margin: "20px 20px 0px 40px",
        display:'flex',
        justifyContent:'center'
    },
    authorText: {
        width: "calc(100% - 50px)",
        // border: "none",
        // resize: "none",
        fontSize: "1.2em",
        // fontStyle: "italic",
        lineHeight: "1.2",
        outline: "none",
        // paddingLeft:"20px",
        margin: "20px 20px 20px 40px",
        display:'flex',
        justifyContent:'center'
    },
    cardsComp: {
        margin: "20px 20px 0px 20px",
        width: "calc(100% - 50px)",
    },
    contentComp: {
        background: '#fff',
        margin:20,
    },
    funcComp: {
        display: 'none',
    },
    visBox: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '250px',
    },
    caption:{
        textAlign: 'center',
        height:'30px',
        alignContent:'center'
    }
})


function ExportStory() {
    const {storyId}= useParams();
    const classes = useStyles()

    const loadStory =  window.localStorage.getItem("STORY_"+storyId)
    const [storyStore, setStoryStore] = useState(JSON.parse(loadStory))

    console.log(JSON.stringify(storyStore));

    const loadedNetworks = Object.keys(window.localStorage)
        .filter(k => k.startsWith("NETWORK_WIZARD_"))
        .map(n => n.slice(15))



    const loadedEditor = Object.keys(window.localStorage)
        .filter(k => k.startsWith("EDITOR_COMPONENTS_"+storyId))
        .map((n) => {
            const editorStr = window.localStorage.getItem(n)
            if (editorStr) {
                return JSON.parse(editorStr)
            }
            return null
        })


    const [networkStore, setNetworkStore] = useState(loadedNetworks)
    const [editorStore, setEditorStore] = useState(loadedEditor)

    const storyContext = useMemo(
        () => ({ networkStore, setNetworkStore, editorStore, setEditorStore }),
        [networkStore, editorStore]
    )

    const sortEd = (a: Editor, b: Editor) => {
        return Date.parse(b.created) - Date.parse(a.created)
    }

    const network = "marieboucher"
    //const visTypeList = visTypes?.split('+') as string[]

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


    const getTitle = window.localStorage.getItem("title");
    const getAuthor = window.localStorage.getItem("author");
    const dateCreated = window.localStorage.getItem("created");
    //alert("getTitle"+getTitle+"  getTitle"+getAuthor);
    const [title, setTitle] = useState(getTitle)
    const [author, setAuthor] = useState(getAuthor)
    const [created, setdateCreated] = useState(dateCreated)

    return (
        <StoryContext.Provider value={storyContext}>

            <div className={classes.root}>
                <div className={classes.header}>
                    <a href="./" style={{marginBottom: "20px", textAlign: 'center', marginTop: 15}}>
                        <img src="./logos/logo-a.png" style={{width: 180}}/>
                    </a>
                </div>


                    <div className={classes.main}>

                        <div className="editor" style={{paddingTop: "20px", paddingLeft: "30px"}}>

                            <div className={classes.titleText}>{storyStore.title}</div>
                            <div className={classes.authorText}>{storyStore.author} , {storyStore.created}</div>
                            <br/>


                            <div id="mainContainerBlog" key={storyId}>

                                {editorStore.sort(sortEd).map((editor: Editor) => (

                                    <div className="item" id={`id${editor.id}`} key={`key${editor.id}`}>

                                        {
                                            editor.type == "text" ? (
                                                <div className={classes.cardsComp} id={`idText${editor.id}`}>
                                                    <div className={classes.contentComp}>
                                                        <EditorTextParser data={editor.textContent}/>
                                                    </div>

                                                </div>
                                            ) : editor.type == "vis" ? (

                                                <div className={classes.cardsComp} id={editor.id}>
                                                    {
                                                        editor.isAddedVis ? (
                                                            <div className={classes.contentComp}
                                                                 style={{minHeight: '250px'}}>

                                                                <div style={{padding: "20px"}}>

                                                                    <NetVis key={`vis${editor.id}`}
                                                                            storyId={storyId}
                                                                            editorId={editor.id}
                                                                            visTypeList={editor.visTypeList}
                                                                            network={editor.networkEd as string}
                                                                            options={options}/>
                                                                </div>


                                                                <div id={editor.id}
                                                                     style={{textAlign: 'center'}}
                                                                >
                                                                    {editor.caption}
                                                                </div>

                                                            </div>
                                                        ) : ""
                                                    }

                                                </div>

                                            ) : (

                                                <div className={classes.cardsComp} id={editor.id}>
                                                    <div className={classes.contentComp}>

                                                        <Row>
                                                            <Col span={10}>
                                                                <EditorTextParser data={editor.textContent}/>
                                                            </Col>
                                                            <Col span={14} style={{minHeight: "300px"}}>

                                                                <div style={{padding: "20px"}}>
                                                                    {
                                                                        editor.isAddedVis ? (
                                                                            <NetVis key={editor.id}
                                                                                    visTypeList={editor.visTypeList}
                                                                                    network={editor.networkEd as string}
                                                                                    options={options}/>
                                                                        ) : ""
                                                                    }
                                                                </div>


                                                                <div id={editor.id}
                                                                     style={{textAlign: 'center'}}
                                                                >
                                                                    {editor.caption}
                                                                </div>


                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </div>

                                            )
                                        }

                                    </div>


                                ))}
                            </div>

                        </div>


                    </div>

                </div>

        </StoryContext.Provider>
    )
}


export default ExportStory