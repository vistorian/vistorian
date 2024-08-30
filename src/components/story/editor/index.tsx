// import React, {useContext, useEffect, useMemo, useState} from 'react';
// import {OperationType, Session} from '../../../../typings';
// import {Button, message} from 'antd';
// import { Layout, theme } from 'antd';
// import {createUseStyles} from "react-jss";
// import {Link} from "react-router-dom";
// import {WizardContext} from "../../wizard/context";
// import {filter, find} from "lodash-es";
// import templates from "../../templates/templates";
// import {defaultDatasets, defaultNetworks, HANDLEALL} from "../../../../typings/constant";
// import {CopyFilled, DeleteFilled} from "@ant-design/icons";
// import Sessions from "../../wizard/session";
//
// const { Header, Content, Footer, Sider } = Layout;
//
//
// interface ISessionsProps {
//     moveToNewSession: (type: string) => void
// }
//
//
// const useStyles = createUseStyles({
//     root: {
//         display: "flex",
//         justifyContent: "flex-start",
//         height: '100%',
//         color: '#333',
//     },
//     list: {
//         width: 300,
//         height: '100%',
//         borderRight: '1px solid #d9d9d9',
//         marginRight: 20,
//     },
//     main: {
//         width: "calc(100% - 320px)",
//         maxHeight: '95vh',
//         overflow: 'scroll'
//     },
//     header: {
//         display: "flex",
//         flexDirection: "column",
//     },
//     cards: {
//         display: 'flex',
//         flexWrap: 'wrap'
//     },
//     card: {
//         width: 180,
//         margin: "40px 20px 0px 20px",
//         display: 'flex',
//         '&:hover $content': {
//             cursor: 'pointer',
//             borderColor: 'transparent',
//             boxShadow: '0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09)'
//         },
//         '&:hover $func': {
//             display: 'flex',
//             flexDirection: 'column',
//         }
//     },
//     content: {
//         background: '#fff',
//         boxShadow: '0px 0px 3px 0px #0000000D',
//         borderRadius: 6,
//         width: 180,
//     },
//     thumbnail: {
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: '5px',
//         border: '1px solid #f6f6f6',
//         borderRadius: '6px 6px 0px 0px',
//         width: 168,
//         height: 170
//     },
//     visTitle: {
//         fontWeight: 'bold',
//     },
//     footer: {
//         height: 40,
//         width: 170,
//         paddingLeft: 10,
//         background: '#f6f6f6',
//         borderRadius: '0px 0px 6px 6px',
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'flex-end',
//         paddingBottom: '5px',
//     },
//     func: {
//         display: 'none',
//     },
//     addSession: {
//         background: '#fff',
//         boxShadow: '0px 0px 20px 0px #0000000D',
//         borderRadius: 6,
//         width: 180,
//         height: 227,
//         margin: "40px 20px 0px 20px",
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         fontSize: 18,
//         '&:hover': {
//             cursor: 'pointer',
//             borderColor: 'transparent',
//             boxShadow: '0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09)'
//         }
//     }
// })
//
// function Editor(props: ISessionsProps){
//     const {
//         token: { colorBgContainer, borderRadiusLG },
//     } = theme.useToken();
//
//     const classes = useStyles()
//
//     const [main, setMain] = useState('sessions')
//     // which data/network is previewing
//     const [preview, setPreview] = useState<string>('')
//     // select a network for visualizing
//     const [selectedNetwork, setSelectedNetwork] = useState<string>('')
//     // when creating a new session, decide on network source
//     // true for select an existing one, false for upload a new one
//     const [netSource, setNetSource] = useState<boolean|undefined>()
//     // whenever clicking create a visualization, trigger re-mounting the component
//     const [triggerReMount, setTriggerReMount] = useState<number>(123)
//
//
//     /**
//      * @description
//      * @param {string[]} files: an array of file names
//      */
//     async function loadAndStoreFiles(files: string[]) {
//         for (const filename of files) {
//             const response = await fetch(`./data/${filename}`)
//             const text = await response.text()
//             window.localStorage.setItem(filename, text)
//         }
//     }
//
//     useEffect(() => {
//         let filesToStore = Array.from(defaultDatasets).map(d =>`UPLOADED_FILE_${d}`)
//         // filesToStore.push(...Array.from(defaultDatasets).map(d => `UPLOADED_FILEINFO_${d}`))
//         filesToStore.push(...Array.from(defaultNetworks).map(n =>`NETWORK_WIZARD_${n}`))
//         // console.log('filesToStore', filesToStore)
//         loadAndStoreFiles(filesToStore)
//     }, []);
//
//     const loadedFiles = Object.keys(window.localStorage)
//         .filter(k => k.startsWith("UPLOADED_FILE_"))
//         .map(n => n.slice(14))
//
//     const loadedNetworks = Object.keys(window.localStorage)
//         .filter(k => k.startsWith("NETWORK_WIZARD_"))
//         .map(n => n.slice(15))
//
//     const loadedSessions = Object.keys(window.localStorage)
//         .filter(k => k.startsWith("SAVED_SESSION_"))
//         .map((n) => {
//             const sessionStr = window.localStorage.getItem(n)
//             if (sessionStr) {
//                 return JSON.parse(sessionStr)
//             }
//             return null
//         })
//
//     // handle the initialization based on the cache
//     const [fileNameStore, setFileNameStore] = useState(loadedFiles)
//     const [networkStore, setNetworkStore] = useState(loadedNetworks)
//     const [sessionStore, setSessionStore] = useState(loadedSessions)
//     const wizardContext = useMemo(
//         () => ({ fileNameStore, setFileNameStore, networkStore, setNetworkStore, sessionStore, setSessionStore }),
//         [fileNameStore, networkStore, sessionStore]
//     )
//
//     // clear data or network
//     const [open, setOpen] = useState<boolean>(false)
//     const [clearType, setClearType] = useState<OperationType>(null)
//     const [selectedToDelete, setSelectedToDelete] = useState<string>('')
//
//     const { moveToNewSession } = props
//
//     const {sessionStore, setSessionStore} = useContext(WizardContext)
//     console.log('Number of sessions :', JSON.stringify(sessionStore));
//
//     const [open, setOpen] = useState(false)
//     const [deleteSession, setDeleteSession] = useState<string|number>('')
//
//     const toDelete = (sessionId: string|number) => {
//         // if (sessionId === HANDLEALL) {
//         //     sessionStore.map((s: Session) => window.localStorage.removeItem("SAVED_SESSION_" + s.id))
//         //     setSessionStore([] as Session[])
//         //     message.success('All visualizations have been successfully deleted!')
//         // }
//         // else {
//             window.localStorage.removeItem("SAVED_SESSION_" + sessionId)
//             const newStore = filter(sessionStore, (ss) => ss.id !== sessionId)
//             setSessionStore(newStore)
//             message.success('The selected visualization has been successfully deleted!')
//        // }
//         setOpen(false)
//     }
//
//     const toCopy = (session: Session) => {
//         let maxId = Math.max(...sessionStore.map(s => s.id))
//         const newSession = {
//             id: maxId + 1,
//             network: session.network,
//             vis: session.vis,
//             created: new Date().toLocaleString('en-GB', {
//                 year: "numeric",
//                 month: "short",
//                 day: "numeric",
//                 hour: "numeric",
//                 minute: "numeric"
//             })
//         }
//         window.localStorage.setItem("SAVED_SESSION_" + newSession.id, JSON.stringify(newSession))
//         setSessionStore([...sessionStore, newSession])
//         message.success('The selected visualization has been successfully copied!')
//
//     }
//
//     const sortSession = (a: Session, b: Session) => {
//         return Date.parse(b.created) - Date.parse(a.created)
//     }
//
//
//     return (
//         <div className={classes.root}>
//             <Layout style={{ width: '100%', height: '100%', margin:0, padding:0}}>
//                 <Header style={{ display: 'flex', alignItems: 'center', backgroundColor:'#E17819' }}>
//                     <div className="demo-logo" />
//                     <h2 style={{ color: 'white' }}> NetPanorama Blog Editor </h2>
//
//                 </Header>
//                 <Content style={{ padding: '0' }}>
//                     {/*<Breadcrumb style={{ margin: '16px 16px' }}>*/}
//                     {/*    <Breadcrumb.Item>Home</Breadcrumb.Item>*/}
//                     {/*    <Breadcrumb.Item>New Blog</Breadcrumb.Item>*/}
//                     {/*</Breadcrumb>*/}
//                     <Layout
//                         style={{ padding: '24px 0', background: colorBgContainer, borderRadius: borderRadiusLG }}
//                     >
//                         <Sider style={{background: colorBgContainer}} width={200}>
//                             <div className={classes.cards}>
//                                 {sessionStore.sort(sortSession).map((session: Session) => {
//                                     console.log('Number of sessions in sessionStore:', sessionStore.length);
//
//                                     if (Array.isArray(session.vis)) {
//                                         session.vis = session.vis[0];
//                                     }
//
//                                     const images = session.vis.split('+').map((v) => find(templates, t => t.key === v)?.image) as string[]
//                                     return (
//                                         <div className={classes.card} key={session.id}>
//                                             {/* content */}
//                                             <Link
//                                                 to={`/vis/${session.vis}/network/${session.network}`}
//                                                 target='_blank'
//                                                 style={{textDecoration: 'none', color: 'black'}}
//                                             >
//                                                 <div className={classes.content}>
//                                                     <div className={classes.thumbnail}>
//                                                         {images.map((img: string, index: number) => (
//                                                             <img
//                                                                 src={`./thumbnails/${img}`}
//                                                                 key={index}
//                                                                 style={{width: `${170 / images.length}px`}}/>
//                                                         ))}
//                                                     </div>
//                                                     <div className={classes.footer}>
//                                                         <span className={classes.visTitle}>{session.network}</span>
//                                                         <span style={{
//                                                             fontSize: 10,
//                                                             marginTop: '-3px'
//                                                         }}>{session.created}</span>
//                                                     </div>
//                                                 </div>
//                                             </Link>
//                                         </div>
//                                     )
//                                 })}
//                                 {/*<div className={classes.addSession} onClick={() => moveToNewSession('newSession')}>*/}
//                                 {/*    + New Visualization*/}
//                                 {/*</div>*/}
//                             </div>
//                         </Sider>
//                         <Content style={{padding: '0 24px', minHeight: 280}}>
//                             KONTEN UNTUK EDITOR JS
//                         </Content>
//                     </Layout>
//                 </Content>
//                 <Footer style={{textAlign: 'center'}}>
//                     NetPanorama Blog Editor ©{new Date().getFullYear()}
//                 </Footer>
//             </Layout>
//         </div>
//     );
// };
//
// export default Editor