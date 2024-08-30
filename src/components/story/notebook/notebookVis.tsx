import { createUseStyles } from 'react-jss'
import { Session } from '../../../../typings'
import { HANDLEALL } from '../../../../typings/constant'
import templates from '../../templates/templates'
import { filter, find } from 'lodash-es'
import React, {useContext, useEffect, useState} from 'react'
import { StoryContext } from '../context'
import { Link } from 'react-router-dom'
import {Button, Modal, message, Input} from 'antd'
import { DeleteFilled, CopyFilled } from '@ant-design/icons'
import {useDrag} from "react-dnd"
import {VisBox} from "./visBox";
import SearchBar from "./searchBar";

const useStyles = createUseStyles({
    cards: {
        display: 'flex',
        flexWrap: 'wrap',
        paddingRight:'5px'
    },
    card: {
        border: '1px dashed gray',
        backgroundColor: 'white',
        padding: '0.5rem 1rem',
        marginRight: '1.5rem',
        marginBottom: '1.5rem',
        cursor: 'move',
        float: 'left',
    },
    content: {
        background: '#fff',
        boxShadow: '0px 0px 3px 0px #0000000D',
        borderRadius: 6,
        width: 190,
    },
    thumbnail: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '5px',
        border: '1px solid #f6f6f6',
        borderRadius: '6px 6px 0px 0px',
        width: 178,
        height: 170
    },
    visTitle: {
        fontWeight: 'bold',
    },
    footer: {
        height: 40,
        width: 170,
        paddingLeft: 10,
        paddingRight: 10,
        background: '#f6f6f6',
        borderRadius: '0px 0px 6px 6px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingBottom: '5px',
    },
    footerBtn: {
        height: 40,
        width: 170,
        paddingLeft: 10,
        paddingRight: 10,
        background: '#f6f6f6',
        borderRadius: '0px 0px 6px 6px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingBottom: '5px',
    },
    func: {
        display: 'none',
    },
})

interface ISessionsProps {
    key: string,
    name: string,
    type:string,
    isDropped:boolean
}

function NotebookVis(props: ISessionsProps) {
    const classes = useStyles()
    const [loading, setLoading] = useState(true);
    const {sessionStore, setSessionStore} = useContext(StoryContext)
    const component=sessionStore
    const [open, setOpen] = useState(false)
    const [deleteSession, setDeleteSession] = useState<string|number>('')

    const toDelete = (sessionId: string|number) => {
        if (sessionId === HANDLEALL) {
            sessionStore.map((s: Session) => window.localStorage.removeItem("SAVED_SESSION_" + s.id))
            setSessionStore([] as Session[])
            message.success('All visualizations have been successfully deleted!')
        }
        else {
            window.localStorage.removeItem("SAVED_SESSION_" + sessionId)
            const newStore = filter(sessionStore, (ss) => ss.id !== sessionId)
            setSessionStore(newStore)
            message.success('The selected visualization has been successfully deleted!')
        }
        setOpen(false)
    }

    const toCopy = (session: Session) => {
        const maxId = Math.max(...sessionStore.map(s => s.id))
        const newSession = {
            id: maxId + 1,
            network: session.network,
            vis: session.vis,
            created: new Date().toLocaleString('en-GB', {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric"
            })
        }
        window.localStorage.setItem("SAVED_SESSION_" + newSession.id, JSON.stringify(newSession))
        setSessionStore([...sessionStore, newSession])
        message.success('The selected visualization has been successfully copied!')
    }


    const sortSession = (a: Session, b: Session) => {
        return Date.parse(b.created) - Date.parse(a.created)
    }


    const [keyword, setKeyword] = useState('');
    const [activeFilter, setActiveFilter] = useState(sessionStore);
   // activeFilter = sessionStore;
    const updateKeyword = (keyword) => {
        const filtered = sessionStore.filter(session => {
            return `${session.network.toLowerCase()}`.includes(keyword.toLowerCase());
        })
        setKeyword(keyword);
        setActiveFilter(filtered);
        console.log("keyword"+keyword+"======="+JSON.stringify(filtered));
    }

    return (
        <>
            <SearchBar keyword={keyword} onChange={updateKeyword}/>
            <div className={classes.cards}>
                {activeFilter.sort(sortSession).map((session: Session)=> {
                    console.log("sessionStore"+JSON.stringify(sessionStore));
                    if (Array.isArray(session.vis)) {
                        session.vis = session.vis[0];
                    }

                    const images = session.vis.split('+').map((v) => find(templates, t => t.key === v)?.image) as string[]
                    return (
                        <div style={{overflow: 'hidden', clear: 'both'}}>
                            <VisBox
                                id={session.id}
                                vis={session.vis}
                                network={session.network}
                                created={session.created}
                                img={images}
                            />
                        </div>
                    )
                })}

            </div>
        </>
    )
}

export default NotebookVis