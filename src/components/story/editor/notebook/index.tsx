import { createUseStyles } from 'react-jss'
import { Session } from '../../../../../typings'
import { HANDLEALL } from '../../../../../typings/constant'
import templates from '../../../templates/templates'
import { filter, find } from 'lodash-es'
import {useContext, useEffect, useState} from 'react'
import { BlogContext } from '../../context'
import { Link } from 'react-router-dom'
import { Button, Modal, message } from 'antd'
import { DeleteFilled, CopyFilled } from '@ant-design/icons'
import {useDrag} from "react-dnd"

const useStyles = createUseStyles({
    cards: {
        display: 'flex',
        flexWrap: 'wrap',
        paddingRight:'25px'
    },
    card: {
        width: 180,
        margin: "15px 15px 0px 15px",
        display: 'flex',
        '&:hover $content': {
            cursor: 'pointer',
            borderColor: 'transparent',
            boxShadow: '0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09)'
        },
        '&:hover $func': {
            display: 'flex',
            flexDirection: 'column',
        },
        cursor: 'move',
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
    id: string,
    name: string
}

function Notebook(props: ISessionsProps) {
    const classes = useStyles()

    const {sessionStore, setSessionStore} = useContext(BlogContext)
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
        let maxId = Math.max(...sessionStore.map(s => s.id))
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

    const ItemTypes = {
        BOX: 'box',
    };

    //

    // const [{ isDragging }, drag] = useDrag(() => ({
    //     type: ItemTypes.BOX,
    //     item: { "name":"BOX1" },
    //     end: (item, monitor) => {
    //         const dropResult = monitor.getDropResult<DropResult>()
    //         if (item && dropResult) {
    //             alert(`You dropped ${item.name} into ${dropResult.name}!`)
    //         }
    //     },
    //     collect: (monitor) => ({
    //         isDragging: monitor.isDragging(),
    //         handlerId: monitor.getHandlerId(),
    //     }),
    // }))

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'box',
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),

        }),
    }));

    return (
        <>
            <Modal
                title={`Delete visualization`}
                open={open}
                onCancel={() => setOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>,
                    <Button
                        key="ok"
                        type="primary"
                        onClick={() => toDelete(deleteSession)}
                    >
                        OK
                    </Button>
                ]}
            >
                <p>Are you sure you want to delete {deleteSession===HANDLEALL ? 'all the visualizations' : 'the selected visualization'} ?</p>
            </Modal>
            <div className={classes.cards}>
                {sessionStore.sort(sortSession).map((session: Session)=> {
                    console.log("sessionStore"+JSON.stringify(sessionStore));
                    if (Array.isArray(session.vis)) {
                        session.vis = session.vis[0];
                    }

                    const images = session.vis.split('+').map((v) => find(templates, t => t.key === v)?.image) as string[]
                    return (
                        <div className={classes.card}  >
                            <Link
                                to={`/vis/${session.vis}/network/${session.network}`}
                                target='_blank'
                                style={{ textDecoration: 'none', color: 'black' }}
                            >
                                <div className={classes.content} style={{
                                    opacity: isDragging ? 0.5 : 1,
                                }}>
                                    <div className={classes.thumbnail}>
                                        {images.map((img: string, index: number) => (
                                            <img
                                                src={`./thumbnails/${img}`}
                                                key={index}
                                                style={{width: `${170 / images.length}px`}}/>
                                        ))}
                                    </div>
                                    <div className={classes.footer}>
                                        {/*<div key={session.id}  ref={drag}  id={session.id} data-testid={`box`}>{isDragging ? 'Dragging' : 'Drag me'}</div>*/}
                                        <span className={classes.visTitle}>{session.network}</span>
                                        <span style={{fontSize: 10, marginTop: '-3px'}}>{session.created}</span>
                                    </div>

                                </div>
                            </Link>
                            <div className={classes.func}>
                                <Button
                                    icon={<CopyFilled/>}
                                    type='text'
                                    shape='circle'
                                    onClick={() => toCopy(session)}
                                />
                                <Button
                                    icon={<DeleteFilled />}
                                    type='text'
                                    shape='circle'
                                    onClick={() => {
                                        setOpen(true)
                                        setDeleteSession(session.id)
                                    }}
                                />
                            </div>
                        </div>
                    )
                })}

            </div>
        </>
    )
}

export default Notebook